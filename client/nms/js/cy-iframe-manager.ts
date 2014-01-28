/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />

import CyEvents = require("./cy-events");
import CyIFrameMessenger = require("./cy-iframe-messenger");
import CyApp = require("./cy-app");
import CyIFrame = require("./ui/component/cy-iframe");
import CyWidget = require("./ui/component/cy-widget");

/**
 * Manages all iframe communications
 *
 * @class CyIFrameManager
 * @module CyUtil
 */
class CyIFrameManager {

    /**
     * initializes the event listeners
     * @constructor
     */
    constructor() {

        // initialize list

        this.iframes = [];

        this.iframesManaged = [];

        // catch all events from the master event bus and propagate them down all our iframe's throats

        CyApp.I.eventBus.all($.proxy(this.sendAll, this));

        // listen to all events sent from iframes

        window.addEventListener('message', $.proxy(this.onMessage, this), false);

    }

    /**
     * listens on all message events from all our child iframes
     * @method onMessage
     * @param e
     * @private
     */
    private onMessage(e) {

        var data = JSON.parse(e.data);
        var event = data.event;
        var payload = data.payload || {};

        // make sure the message originated from the iframe list

        var iframe:CyIFrame = null;
        var index = -1;

        for (var i = 0; i < this.iframesManaged.length; ++i) {

            if (this.iframesManaged[i].contentWindow == e.source) {

                iframe = this.iframesManaged[i];
                index = i;

                break;
            }

        }

        // i don't care about you

        if (!iframe) {

            return;
        }

        // handle messages

        if (event === CyIFrameMessenger.kEVENT_ACK) {

            // this iframe has matured

            this.iframes.push(iframe);

            iframe.sendMessage(CyIFrameMessenger.kEVENT_ACK_RCV);

        } else if (event === CyIFrameMessenger.kEVENT_CLOSED) {

            this.close(iframe);

        } else {

            // pass it along


            payload.sender = iframe;

            CyApp.I.eventBus.trigger(event, payload);
        }

    }

    /**
     * sends a message to all iframes in the list
     * @method sendAll
     * @param message
     * @param payload
     * @public
     */
    public sendAll(message:String, payload?:any) {

        // Note:
        // iterating iframesManaged instead of iframes because I don't want to force
        // the iframe to depend on being initialized properly by the iframe manager to for now

        _.each(this.iframesManaged, function (iframe) {

            // make sure we don't send the message if it came from itself

            if (payload.sender != iframe) {
                iframe.sendMessage(message, payload);
            }

        });
    }

    /**
     * adds an iframe and starts the handshake process with it
     * @method manage
     * @param iframe
     * @public
     */
    public manage(iframe:CyIFrame) {

        iframe.eventBus.on("load", function () {

            iframe.sendMessage(CyIFrameMessenger.kEVENT_PING);

        });

        if (this.iframesManaged.indexOf(iframe) === -1) {

            this.iframesManaged.push(iframe);

        }

    }

    /**
     * remove iframe and give it time to close properly
     * @method unmanage
     * @param iframe
     * @public
     */
    public unmanage(iframe) {

        if (this.iframes.indexOf(iframe) !== -1) {

            iframe.sendMessage(CyIFrameMessenger.kEVENT_CLOSE);

            this.forceClose(iframe);

        }

        var managedIndex = this.iframesManaged.indexOf(iframe);

        if (managedIndex !== -1) {
            this.iframesManaged.splice(managedIndex, 1);
        }
    }

    /**
     * dispose of the iframe properly
     * @method close
     * @param iframe
     * @private
     */
    private close(iframe:CyIFrame) {

        // index position of the frames list

        var frameIndex, managedIndex;

        frameIndex = this.iframes.indexOf(iframe);

        managedIndex = this.iframesManaged.indexOf(iframe);

        if (frameIndex !== -1) {

            this.iframes.splice(managedIndex, 1);

        }

        if (managedIndex !== -1) {

            this.iframesManaged.splice(frameIndex, 1);

        }
    }

    /**
     * Allows the iframe some time to close before forceably removing it
     * @method forceClose
     * @param iframe
     */
    private forceClose(iframe) {

        setTimeout(() => {

            this.close(iframe);

        }, 500);

    }

    /**
     * Get singleton instance
     * @property {CyIFrameManager} I
     * @public
     */
    public static get I():CyIFrameManager {

        if (!CyIFrameManager.instance) {
            CyIFrameManager.instance = new CyIFrameManager();
        }

        return CyIFrameManager.instance;
    }

    /**
     * Singleton member
     * @property {CyIFrameManager} instance
     * @private
     */
    private static instance:CyIFrameManager;

    /**
     * List of child iframes that have been initialized
     * @property {CyIFrame[]} iframes;
     * @private
     */
    private iframes:CyIFrame[];

    /**
     * List of all iframes that are in the list
     * @property {CyIFrame[]} iframesManaged;
     */
    private iframesManaged:CyIFrame[];

}

export = CyIFrameManager;
