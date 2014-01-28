/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/uuid-core.d.ts" />

import CyEvents = require('../../cy-events');
import CyUtils = require('../../util/cy-utils');

/**
 * the common base class of most Cyan UI elements
 */
class CyWidget {

    /* constructor  */
    constructor(private className) {

    }

    /* all CyWidgets get a UUID, created on demand. This can be used to uniquely identify them
       as the source or target of messages sent via the event bus. Since we use a UUID there should not
       collisions even across widgets contained in separate iframes.
       Since not all widgets will require a UUID they are created on demand so access ONLY via
       the getter to prevent disappointment.
     */
    private _uuid:string;
    public get UUID() : string {

        // create on demand

        if (!this._uuid) {

            this._uuid = UUID.generate();
        }

        return this._uuid;
    }

    /**
     * internal event bus. You can switch this for some other event bus to make the widget propagate events
     * on some other bus including the app master bus.
     */
    private _eventBus:CyEvents.CyEventManager;
    public get eventBus():CyEvents.CyEventManager {

        if (!this._eventBus) {

            this._eventBus = new CyEvents.CyEventManager();
        }

        return this._eventBus;
    }

    public set eventBus(value:CyEvents.CyEventManager) {

        this._eventBus = value;

    }

    /**
     * To make it easier to sink events / trigger events with CyWidgets that expose a copy of the CyEventManager
     * public methods ( on, off, trigger etc ). This are just pass throughs to the event manager.
     * See the CyEventManager class for documentation on this elements
     */
    public all(callback:(message:String, payload?:any) => void):number {

        return this.eventBus.all(callback);
    }

    public on(message:String, callback:(payload?:any) => void):number {

        return this.eventBus.on(message, callback);
    }

    public once(message:String, callback:(payload?:any) => void):number {

        return this.eventBus.once(message, callback);
    }

    public off(id:number):void {

        this.eventBus.off(id);
    }

    public trigger(message:String, payload?:any):void {

        this.eventBus.trigger(message, payload);
    }

    /**
     * for DOM elements that are part of a CyWidget, the jquery .data API is used to hold a reference to the
     * actual javascript object instance. The key is the kCW value
     */
    public static kCW:string = 'data-cyanwidget';

    /**
     * this is used as an actual attribute name to decorate wrapped DOM elements.
     * The typescript class name and a CyWidget instance id is used for the value
     */
    public static kCW_TS:string = 'data-tsclass';


    /**
     * the actual element is constructed on demand
     */
    public _e:JQuery;

    public get element():JQuery {

        if (!this._e) {

            // call build element

            this._e = this.buildElement();

            // store the typescript/javascript instance in the "cyan-widget" property of
            // the grid

            this._e.data(CyWidget.kCW, this);

            // finally add an attribute that identifies the ts class and
            // instance that wraps the element

            this._e.attr(CyWidget.kCW_TS, this.getClassName());

        }

        return this._e;
    }

    /**
     * return the CyWidget that wraps the given element
     * @param e
     */
    public static getWidget(e:JQuery):CyWidget {

        if (!e) {
            return null;
        }

        return e.data(CyWidget.kCW);
    }

    /**
     * method for getting the typescript class at runtime
     * @returns {*}
     */
    public getClassName():string {

        return this.className;
    }

    /**
     * dispose a complete subtree of DOM elements, if the element is a CyWidget, also call the dispose method
     * on it
     * @param s
     */
    public static disposeTree(s:JQuery) {

        // ignore null element, since elements are lazily constructed it seems
        // reasonable to allow this since it makes the code cleaner e.g. no need to test
        // if your element exists

        if (!s) {
            return;
        }

        // first dispose all child elements that are cyan widgets...the jquery find
        // method searches all levels of the DOM from this element down

        _.each(s.children('*'), (e:JQuery) => {

            // recursively dispose children first

            CyWidget.disposeTree($(e));

        }, this);

        // if this element is part of a CyWidget call the dispose method

        var w:CyWidget = <CyWidget>($(s).data(CyWidget.kCW));

        if (w) {

            w.dispose();

        }

        // remove element

        s.remove();

    }

    /**
     * remove the element from the DOM. Classes that inherit should call super.dispose()
     * to ensure the correct chaining
     */
    public dispose():void {

        // ensure we are only disposed once

        CyUtils.assert(!this.isDisposed, "Widget has already been disposed");

        // dispose tree

        // CyWidget.disposeTree(this._e);

        // mark as disposed

        this.isDisposed = true;

    }

    /**
     * true once we are disposed
     */
    private isDisposed:boolean = false;

    /**
     * You must overload this method is inheriting classes
     */
    public buildElement():JQuery {

        CyUtils.assert(false, "buildElement must be overridden in inheriting classes");

        return null;
    }


    /**
     * return true if the element has been built already
     * @returns {boolean}
     */
    public get isBuilt():boolean {
        return !!this._e;
    }

    /**
     * this is called from app class whenever a DOMNodeInserted event is fired. When a subtree is added
     * to the DOM the event is fired only for the root of the tree.
     * @param e:JQueryEventObject
     */
    public static DOMNodeInserted(element:JQuery) {


        // first call addedToDOM for any children which are CyWidget derived

        element.children().each( (index:any, e:Element) => {

            CyWidget.DOMNodeInserted($(e));

        });

        // is this element a CyWidget, if so call addedToDOM

        var w:CyWidget = <CyWidget>(element.data(CyWidget.kCW));

        if (w) {

            w.addedToDOM();
        }

    }

    /**
     * Call when the widget is added to the DOM.
     * NOTE: This is ONLY called from the root element of any subtree.
     */
    public addedToDOM():void {

        // base class does nothing, you override in descendant classes

        // console.log("Added To DOM: " + this.getClassName());
    }
}

export = CyWidget;

