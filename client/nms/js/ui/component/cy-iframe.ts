/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/require.d.ts" />

import CyEvents = require("../../cy-events");
import CyUtils = require("../../util/cy-utils");
import CyWidget = require("./cy-widget");
import CyTemplates = require("../../util/cy-templates");
import CyIFrameManager = require("../../cy-iframe-manager");

/**
 * A seamless I-Frame that can be used to frame local and remote pages. Communication is possible
 * using the I-Frame extensions to the EventManager class
 *
 * @module Component
 * @class CyInputBox
 */
class CyIFrame extends CyWidget {


    constructor(url?:string, css?:any) {

        super("CyIFrame");

        this.init();

        if (url) this.src = url;

        if (css) this.element.css(css);
    }

    /**
     * Wrap all of the initialization in a method
     * @returns {JQuery}
     */
    private init() : void {

        // local require to resolve circular ref

        var CyIFrameManager = require("../../cy-iframe-manager");

        // add to iframe manager

        CyIFrameManager.I.manage(this);
    }

    /**
     * the actual element is constructed on demand
     */
    public buildElement() : JQuery {

        // sanity check, only the base class should call us when the element is first needed

        CyUtils.assert(!this.isBuilt, "Element has already been built");

        // clone from template

        return CyTemplates.cloneTemplate("cy-iframe-template");

    }

    /**
     * dispose of any resource, open connections etc
     */
    public dispose() {

        /// local require to resolve circular ref

        var CyIFrameManager = require("../../cy-iframe-manager");

        // remove from iframe manager

        CyIFrameManager.I.unmanage(this);

        // base first

        super.dispose();
    }

    /**
     * Sends a message to the iframe window
     * @param message
     * @param payload
     */
    public sendMessage(message:String, payload:any = {}) {

        if (!this.contentWindow)  {
            return;
        }

        payload = _.clone(payload);

        _.each(payload, function (value:any, key?:string) {

            if (key === 'sender') {

                payload[key] = 'master';

            } else {

                // strip object key if necessary

                if (!_.isNumber(value) && !_.isString(value)) {

                    delete payload[key];

                }
            }

        });


        this.contentWindow.postMessage(JSON.stringify({
            event: message,
            payload: payload
        }), '*');

    }
    /**
     * return the i-frame contentWindow property. The element must exist, be attached to the DOM and have
     * the src url set before the content window property will become available.
     */
    public get contentWindow() : any /* TODO Why can't this be declared as Window */ {

        var ife:HTMLIFrameElement = <HTMLIFrameElement>this.element[0];

        return ife.contentWindow;
    }

    /**
     * return the src url of the i-frame
     * @returns {*}
     */
    private _src:string;
    public get src() : string {
        return this._src;
    }

    /**
     * set the url of the i-frame. The src url is deferred until the element is accessed
     * @param url
     */
    public set src(url:string) {

        // store

        this._src = url;

        // apply to element ( use of this.element ensure the iframe exists )

        this.element.attr('src', this._src);

        // sync iframe load event
        this.element.on('load', (e:JQueryEventObject) => {

            this.eventBus.trigger('load', e);

        });

    }
}

export = CyIFrame;

