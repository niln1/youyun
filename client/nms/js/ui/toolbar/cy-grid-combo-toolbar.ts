/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyToolbar = require("./cy-toolbar");
import CyUtils = require("../../util/cy-utils");
import CyGrid = require("../grid/cy-grid");
import CyInputBox = require("../component/cy-inputbox");
import CyTemplates = require("../../util/cy-templates");
import CyAnalytics = require("../../cy-analytics");

class CyGridComboToolbar extends CyToolbar {

    /**
     * creates a new grid combo toolbar
     *
     * @class CyGridComboToolbar
     * @param settingsName  the name of the settings key
     * @param items         (optional) the list of items that are by active.  it defaults to an empty list which makes everything active
     * @constructor
     */
    constructor(private settingsName, items : string[] = []) {
        super("CyGridComboToolbar");

        this._items = items;
    }

    /**
     * builds the toolbar
     * @method buildElement
     * @returns {JQuery}
     * @public
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate("cyan-grid-combo-toolbar-template");

        // create autocomplete box

        this.inputBox = new CyInputBox(this.settingsName);

        // attach to place holder

        this.inputBox.element.appendTo($('[data-element="filter-box"]', e));

        return e;

    }

    /**
     * Handles all event registration
     * @method postRegister
     * @public
     */
    public postRegister() : void {

        CyUtils.assert(this.owner instanceof CyGrid, "CyGridComboToolbar is attached to a CyGrid descendant");

        this.activateItems();

        // sink change to update grid

        this.inputBox.on(CyInputBox.kCHANGED, (e?:any) => {

            // reload first page of results

            this.owner.filter = e.value;
        });

        if (this.items.indexOf('copy-to-clipboard') != -1) {

            this.addEventAction('copy-to-clipboard', CyGridComboToolbar.kCOPY_TO_CLIPBOARD, this.owner.getClassName(), () => {
                return JSON.stringify(this.owner.selections)
            });

        }

        if (this.items.indexOf('viewer') != -1) {

            this.addEventAction('viewer', CyGridComboToolbar.kVIEWER_CLICKED, this.owner.getClassName(), () => {
                return JSON.stringify(this.owner.selections)
            });

        }

        if (this.items.indexOf('show-affected-services') != -1) {

            this.addEventAction('show-affected-services', CyGridComboToolbar.kAFFECTED_TRAILS_CLICKED, this.owner.getClassName(), () => {
                return JSON.stringify(this.owner.selections)
            });

        }

        if (this.items.indexOf('acknowledge') != -1 ) {

            this.addEventAction('acknowledge', CyGridComboToolbar.kACKNOWLEDGE_CLICKED, this.owner.getClassName(), () => {
                return JSON.stringify(this.owner.selections)
            });
        }


        // enable/disable buttons when selection change

        this.on(CyGrid.kSELECTION_CHANGED, (e?:any) => {

            // if this event doesn't belong to our current owner
            // then don't try to handle it

            if (e.sender != this.owner) {
                return;
            }

            var selections = e.selections;

            if (selections.length > 0) {
                this.enableItem('viewer');
                this.enableItem('acknowledge');
                this.enableItem('copy-to-clipboard')
            } else {
                this.enableItem('viewer', false);
                this.enableItem('acknowledge', false);
                this.enableItem('copy-to-clipboard', false)
            }


            if (selections.length == 1) {
                this.enableItem('show-affected-services');
            } else {
                this.enableItem('show-affected-services', false);
            }

        });
    }

    /**
     * input box for filter text
     */
    private inputBox:CyInputBox;

    /**
     * Activate toolbar items we only care about
     */
    private activateItems() : void {

        // show all items if items is an empty array

        if (this.items.length == 0) {

            // populate items list from the elements present

            this.element.children().each((idx, item) => {
                this._items.push($(item).attr('data-item'));
            });

        } else {

            // hide all buttons first
            this.element.children().each((idx, item) => {
                $(item).hide();
            });

            // show only the ones we want
            _.each(this.items, (item) => {

                var b = this.findItem(item);

                b.show();
            });
        }

    }

    /**
     * List of active items
     */
    private _items : string[];

    public get items() : string[] {
        return this._items;
    }

    /**
     * Triggered when the affected trails button is clicked
     * @event kAFFECTED_TRAILS_CLICKED
     * @public
     * @static
     */
    public static kCOPY_TO_CLIPBOARD = 'cyan-grid-combo-toolbar-copy-to-clipboard';

    public static kAFFECTED_TRAILS_CLICKED = 'cyan-grid-combo-toolbar-affected-trails-clicked';

    public static kVIEWER_CLICKED:string = "cyan-grid-combo-toolbar-viewer-clicked";

    public static kACKNOWLEDGE_CLICKED:string = "cyan-grid-combo-toolbar-acknowledge-clicked";

}

export = CyGridComboToolbar;