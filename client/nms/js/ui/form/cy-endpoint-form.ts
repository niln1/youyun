/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyForm = require("./cy-form");
import CyTab = require("../component/cy-tab");
import CyUNIForm = require("./cy-uni-form");
import CyTemplates = require("../../util/cy-templates");

/**
 * This class creates a tabbed-view for endpoint configuration forms.  The data return depends on the form selected.
 * @class CyEndpointForm
 */
class CyEndpointForm extends CyForm {

    /**
     * @param options
     * @param data
     * @constructor
     */
    constructor(options, data?:any) {

        this.options = options;
        this.data = data;
        this.tabs = [];
        this.tabsToForm = {};

        super("CyEndpointForm");
    }

    /**
     * Builds and registers the elements
     * @returns {JQuery}
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate('cyan-service-endpoints-config-template');
        this.tabPanel = new CyTab.CyTabPanel();
        this.tabPanel.makeInline();
        this.tabPanel.element.appendTo(e);

        // build tabs using forms defined in the constructor options
        _.each(this.options.classes, (classType, key?:any) => {
            var tab = this.tabPanel.addTab(key);
            this.tabs.push(tab);
            this.tabsToForm[this.tabs.length - 1] = this.createClass(key);
        });

        // catch tab events
        this.tabPanel.on(CyTab.CyTabPage.kTAB_OPENED, $.proxy(this.onTabOpened, this));
        this.tabPanel.on(CyTab.CyTabPage.kTAB_SELECTED, $.proxy(this.onTabSelected, this));

        // select first one by default
        this.tabPanel.selectTab(this.tabs[0]);

        return e;
    }

    /**
     * assigns the form when the tab is opened for the first time
     * @param e
     */
    private onTabOpened(e?:any) : void {

        // find the tab index
        var tabIndex = this.tabs.indexOf(e.tab);
        if (tabIndex != -1 ) {
            var form = this.tabsToForm[tabIndex];

            if (form) {
                form.element.appendTo(this.tabs[tabIndex].content);
            }
        }
    }

    /**
     * keep track of selected tab
     * @param e
     */
    private onTabSelected(e?:any) : void {
        this.selectedTab = e.tab;
    }

    /**
     * factory method for creating form classes for this widget
     * @param classType
     * @returns {*}
     */
    private createClass(classType : string) : any {
        var form;
        switch (classType) {
            case 'UNI':
                form = new CyUNIForm();
                break;
            /*
            case 'E-NNI':
                form = new CyNNIForm();
                break;
            */
            default:
                form = null;
        }
        return form;
    }

    /**
     * constructor options
     * @type any
     */
    private options : any;

    /**
     * data to pass to the forms
     * @type any
     */
    private data : any;

    /**
     * list of tabs
     * @type CyTab.CyTabPage
     */
    private tabs : CyTab.CyTabPage[];

    /**
     * main tab class
     * @type CyTab.CyTabPanel
     */
    private tabPanel : CyTab.CyTabPanel;

    /**
     * selected tab
     * @type CyTab.CyTabPage
     */
    private selectedTab : CyTab.CyTabPage;

    /**
     * dictionary of tab indexes to form
     * @type any
     */
    private tabsToForm : any;
}

export = CyEndpointForm;