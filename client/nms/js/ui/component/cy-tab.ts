/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyApp = require('../../cy-app');
import CyWidget = require('./cy-widget');
import CyUtils = require('../../util/cy-utils');
import CyTemplates = require('../../util/cy-templates');

/**
 * @module CyUI
 * @submodule Component
 * @class CyTabPanel
 */
export class CyTabPanel extends CyWidget {

    /**
     * @class CyTabPanel
     * @constructor
     * @param content {JQuery}
     */
    constructor() {
        super("CyTabPanel");
    }

    /**
     * build the entire panel
     */
    public buildElement() {
        var e:JQuery = CyTemplates.cloneTemplate('cyan-tab-panel-template');

        // locate the header strip and content area
        this._headers = $('[data-element="header"]', e);
        this._content = $('[data-element="content"]', e);

        // return the outer element
        return e;
    }

    /**
     * Set up the tab panel as inline tabs that scroll with the rest of the document
     */
    public makeInline() {
        // make the tabContent relatively positioned, remove the top margin and the k-header class
        var tabContent:JQuery = $('.tabContent', this.element);
        tabContent.removeClass('k-header');
        tabContent.css('position', 'relative');
        tabContent.css('top', '0');
    }

    /**
     * cleanup
     */
    public dispose() {
        super.dispose();
    }

    /**
     * create and return a new tab
     *
     * @method addTab
     * @param text {String}
     * @return {CyTabPage} tab
     */
    public addTab(text:string):CyTabPage {

        // create the new page
        var t:CyTabPage = new CyTabPage(text);

        // add to collection
        this._tabs.push(t);

        // add the tab header to our headers area
        t.element.appendTo(this._headers);

        // set up click on header
        t.element.click($.proxy(this.headerClicked, this));

        // send added event
        this.trigger(CyTabPage.kTAB_ADDED, {
            sender: this,
            tab: t
        });

        // return to client
        return t;
    }

    /**
     * remove the tab if selected
     *
     * @method removeTab
     * @param t {CyTabPage}
     */
    public removeTab(t:CyTabPage):void {

        // sanity check
        CyUtils.assert(this._tabs.indexOf(t) >= 0, "Tab is not in collection");

        // unselect if selected
        if (t === this._selectedTab) {
            this.selectTab(null);
        }

        // remove from tabs
        this._tabs = _.without(this._tabs, t);

        // send removed event
        this.trigger(CyTabPage.kTAB_REMOVED, {
            sender: this,
            tab: t
        });

        // cleanup the tab
        CyWidget.disposeTree(t.element);
    }

    /**
     * when one of the headers is clicked
     *
     * @method headerClicked
     * @param {JQueryEventObject} e
     * @private
     */
    private headerClicked(e:JQueryEventObject):void {
        // get the actual tab object that owns the clicked element
        var t:CyTabPage = <CyTabPage>CyWidget.getWidget($(e.target));

        // select the tab
        this.selectTab(t);
    }

    /**
     * select the tab
     *
     * @method selectTab
     * @param t {CyTabPage}
     */
    public selectTab(t:CyTabPage):void {

        // ignore if already selected
        if (t === this._selectedTab) {
            return;
        }

        // unselect existing tab. Hide content and remove selection style from header
        if (this._selectedTab) {
            this._selectedTab.content.addClass('hidden');
            this._selectedTab.element.removeClass('k-state-selected');

            this.trigger(CyTabPage.kTAB_UNSELECTED, {
                sender: this,
                tab: this._selectedTab
            });
        }

        // select new tab if any
        this._selectedTab = t;

        if (this._selectedTab) {
            // highlight tab
            this._selectedTab.element.addClass('k-state-selected');
            this._selectedTab.element.removeClass('k-state-hover');

            // remove hidden if present from content
            this._selectedTab.content.removeClass('hidden');

            // parent if not already added
            if (this._selectedTab.content.parent().length === 0) {
                this._selectedTab.content.appendTo(this._content);

                this.trigger(CyTabPage.kTAB_OPENED, {
                    sender: this,
                    tab: this._selectedTab
                });
            }

            this.trigger(CyTabPage.kTAB_SELECTED, {
                sender: this,
                tab: this._selectedTab
            });
        }
    }

    /**
     * headers and content area
     *
     * @property {JQuery} _headers
     */
    private _headers:JQuery;

    /**
     * @property {JQuery} _content
     */
    private _content:JQuery;

    /**
     * the currently selected tab
     *
     * @property {CyTabPage} _selectedTab
     */
    private _selectedTab:CyTabPage;

    /**
     * @method selectedTab
     * @returns {CyTabPage} tab
     */
    public get selectedTab():CyTabPage {
        return this._selectedTab;
    }

    /**
     * all tabs in display order
     * @type {Array}
     * @private
     */
    private _tabs:CyTabPage[] = [];

    /**
     * @method tabs
     * @returns {CyTabPage[]} tabs
     */
    public get tabs():CyTabPage[] {
        return this._tabs;
    }

    /**
     * lookup for tracking event subscription tokens
     *
     * @property {Object} eventTokens
     */
    private eventTokens:Object = {};
}

/**
 * represents a single tab in control
 *
 * @module Component
 * @class CyTabPage
 */
export class CyTabPage extends CyWidget {

    /**
     * you supply the initial title and content
     *
     * @class CyTabPage
     * @constructor
     * @param _text {String}
     */
     constructor(private _text:string) {
        super("CyTabPage");
    }

    /**
     * build the element
     */
    public buildElement() : JQuery {

        // create a button for the tab header
        var e = CyTemplates.cloneTemplate('tab-header-button-template');
        e.text(this._text);

        // apply kendo hover style on mouse over/out
        e.hover(
            function () {
                if (!$(this).hasClass('k-state-selected')) {
                    $(this).addClass('k-state-hover');
                }
            },
            function () {
                $(this).removeClass('k-state-hover');
            }
        )

        // this element is used to hold the contents of the tab when selected and made visible.
        // It is not attached to the DOM until then
        this._content = CyTemplates.cloneTemplate('tab-content-place-holder-template');

        // return outer element
        return e;
    }

    /**
     * cleanup
     */
    public dispose() {
        super.dispose();
    }

    /**
     * fired when a tab is displayed for the first time. ( not necessarily when added, but always before the first
     * selected event occurs )
     *
     * @static
     * @property {String} kTAB_OPENED
     */
    public static kTAB_OPENED:string = "cytab-opened";

    /**
     * fired when a tab is selected
     * @static
     * @property {String} kTAB_SELECTED
     */
    public static kTAB_SELECTED:string = "cytab-selected";

    /**
     * fired when a tab is unselected
     * @static
     * @property {String} kTAB_UNSELECTED
     */
    public static kTAB_UNSELECTED:string = "cytab-unselected";

    /**
     * fired when a tab is removed from the control
     * @static
     * @property {String} kTAB_REMOVED
     */
    public static kTAB_REMOVED:string = "cytab-removed";

    /**
     * fired when a tab is added to the control
     * @static
     * @property {String} kTAB_ADDED
     */
    public static kTAB_ADDED:string = "cytab-added";

    /**
     * header text
     *
     * @method text
     * @returns {string} text
     */
    public get text():string {
        return this._text;
    }

    /**
     * content element for tab, you should parent you own content to this
     * when the tab is first opened or selected
     *
     * @property {JQuery} _content
     * @returns {JQuery}
     */
    private _content:JQuery;

    /**
     * @method content
     * @returns {JQuery} content
     */
    public get content():JQuery {
        return this._content;
    }
}