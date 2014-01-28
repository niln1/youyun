/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyWidget = require("../component/cy-widget");
import CyUtils = require("../../util/cy-utils");
import CyMessage = require("../../cy-message");

/**
 * Base class for all the toolbars.
 * @class CyToolbar
 */
class CyToolbar extends CyWidget {

    constructor(className) {
        super(className);
    }

    /**
     * Adds an event action which corresponds to one of the item being clicked.  Use this for non-widgetized components
     *
     * @method addAction
     * @param itemName    the name of the button
     * @param event         the name of the event to trigger on the event bus
     * @param data          the data callback which returns the data for the event
     * @public
     */
    public addEventAction(itemName : string, eventName : string, type: string, dataCb?:() => any, eventType : string = 'click') {

        var item = this.findItem(itemName);

        if (item) {

            // unbind and bind click to ensure only one click handler is sunk

            item.unbind(eventType).bind(eventType, (evt:JQueryEventObject) => {

                this.trigger(eventName, {
                    sender: this,
                    data: (dataCb) ? dataCb() : null,
                    type: type,
                    classType: this.owner.getClassName(),
                    uuid: this.owner.UUID
                });
            });

        }

    }

    /**
     * Adds a click action which corresponds to one of the item being clicked.  Use this for non-widgetized components
     *
     * @method addAction
     * @param itemName    the name of the button
     * @param type          a type string to help identify the event
     * @param dataCb          the data callback which returns the data for the event
     * @public
     */
    public addClickAction(itemName : string, type: string, dataCb?:() => any) {

        this.addEventAction(itemName, CyMessage.kTOOLBAR_BUTTON_CLICKED, type, dataCb, 'click');
    }

    /**
     * Adds a custom handler to the item being clicked.
     * @param itemName
     * @param handler
     */
    public addCustomAction(itemName : string, handler : (e:any) => void, eventType : string = 'click') {

        var item = this.findItem(itemName);

        if (item) {

            item.unbind(eventType).bind(eventType, function (evt:JQueryEventObject) {
                handler(evt);
            });
        }
    }

    /**
     * Enables or disables an item on the toolbar
     *
     * @method enableItem
     * @param itemName
     * @param enable
     * @public
     */
    public enableItem(itemName : string, enable : boolean = true) : void {

        var item = this.findItem(itemName);

        if (!item) {

            return;

        }

        if (enable) {

            item.removeAttr('disabled');

            item.removeClass('k-state-disabled')

        } else {

            item.attr('disabled', 'disabled');

            item.addClass('k-state-disabled');

        }
    }

    /**
     * Helper method to find item in the toolbar
     * @param itemName
     * @returns {*}
     */
    public findItem(itemName) : JQuery {

        var item = $('[data-item=' + itemName + ']', this.element);

        if (item.length) {
            return item;
        } else {
            return null;
        }
    }

    /**
     * Ties this toolbar with the owner.
     *
     * @method register
     * @param owner
     * @public
     */
    public register(owner : any) : void {

        this._owner = owner;

        // i'd like the toolbar to talk to the same event bus as the owner

        this.eventBus = owner.eventBus;

        this.postRegister();
    }

    /**
     * You need to override this to perform bind any events from the owner.  For example, calling addAction in the child
     * classes would be best inside of postRegister.
     *
     * @method postRegister
     * @public
     */
    public postRegister() : void {

        CyUtils.assert(false, "postRegister is not overridden");

    }

    /**
     * Handle to the owner
     * @type any
     * @private
     */
    private _owner : any;

    public get owner() : any {
        return this._owner;
    }

}

export = CyToolbar;