/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyApp = require("../../cy-app");
import CyView = require("./cy-view");
import CyEvents = require("../../cy-events");
import CyTemplates = require("../../util/cy-templates");
import CyServicesGrid = require("../grid/cy-services-grid");
import CyServiceForm = require("../form/cy-service-form");
import CySplitter = require("../component/cy-splitter");
import CyServicesToolbar = require("../toolbar/cy-services-toolbar");
import CyMessage = require("../../cy-message");
import CyDialog = require("../window/cy-dialog");

/**
 * main view for the provisioning page
 */
class CyProvisionView extends CyView {

    constructor() {
        super("CyProvisionView");
    }

    public buildElement():JQuery {

        this.eventTokens = new CyEvents.EventIDList(CyApp.I.eventBus);

        var e:JQuery = this.createPanelLayout();

        CyApp.I.showNavigationHeaders();

        return e;
    }

    /**
     * Create the root element for this view which is a collapsible panel
     * @returns {JQuery}
     */
    private createPanelLayout():JQuery {

        var rootPanelDiv = CyTemplates.cloneTemplate("cyan-services-panel-template");

        this.rootPanel = $('[data-element=panelbar]', rootPanelDiv).kendoPanelBar({
            expandMode: 'single'
        }).data('kendoPanelBar');

        this.resizePanelToFit(rootPanelDiv);

        return rootPanelDiv;
    }

    public addedToDOM() : void {
        this.createSplitterLayout();
    }

    private createSplitterLayout() : void {

        this.serviceSplitter = new CySplitter(this, null, $('[data-element=splitter]', this.element), 'provision-view-root', 'vertical');
        this.serviceSplitter.append("services-grid");
        this.serviceSplitter.append("services-form", {
         size: "70%",
         collapsible: false
         });

        var gridContainer = this.serviceSplitter.children[0].element;
        var configContainer = this.serviceSplitter.children[1].element;

        // initialize services grid
        this.servicesGrid = new CyServicesGrid();
        this.servicesGrid.eventBus = CyApp.I.eventBus;
        this.servicesGrid.element.appendTo(gridContainer);
        this.servicesGrid.setGridHeight(gridContainer.height());
        this.servicesGrid.toolbar = new CyServicesToolbar();

        // handle toolbar events for the services grid

        this.eventTokens.add(CyApp.I.eventBus.on(CyMessage.kTOOLBAR_BUTTON_CLICKED, $.proxy(this.onToolbarBtnClicked, this)));
        this.eventTokens.add(CyApp.I.eventBus.on(CySplitter.kSPLIT_VIEW_RESIZED, $.proxy(this.onResize, this)));
        this.eventTokens.add(CyApp.I.eventBus.on(CyApp.kBROWSER_RESIZED, $.proxy(this.onResize, this)));
    }

    private onResize() {
        if (this.servicesGrid) {
            this.servicesGrid.setGridHeight(this.serviceSplitter.children[0].element.height());
        }
        this.resizePanelToFit(this.element);
    }

    private resizePanelToFit(e:JQuery) {
        // make the panelbar full height like jQuery's accordion panel
        $('.k-panelbar .k-content', e).css({
            height: $('.master-page-body').height() - 56
        });
    }

    /**
     * Respond to toolbar commands
     * @param e
     */
    private onToolbarBtnClicked(e) : void {

        if (e.classType == this.servicesGrid.getClassName() && e.type == 'new-services') {

            // create new service forms
            this.showServiceForm();

        } else if (e.classtype = this.servicesGrid.getClassName() && e.type == 'service-details') {

            // verify if selection is provided
            if (e.data && e.data.length == 1) {

                // show existing service
                this.showServiceForm(e.data[0]);

            } else {
                // inform the user what they did wrong
                CyDialog.messageDialog("Information", "You must select a service");
            }
        }
    }

    /**
     * Open up the service form
     * @param id        a unique service identifier
     */
    private showServiceForm(service?:any) : void {

        var element = this.serviceSplitter.children[1].element;

        if (!this.serviceForm) {

            this.serviceForm = new CyServiceForm(service);
            this.serviceForm.element.appendTo(element);
        }
    }

    public dispose(): void {

        if (this.eventTokens) {
            this.eventTokens.allOff();
        }
    }

    /**
     * event id list
     * @type CyEvents.EventIDList
     * @private
     */
    private eventTokens:CyEvents.EventIDList;

    /**
     * kendo panel bar widget
     * @type kendo.ui.PanelBar
     * @private
     */
    private rootPanel:kendo.ui.PanelBar;

    /**
     * iframe for the services grid
     * @type CyIFrame
     * @private
     */
    private servicesGrid:CyServicesGrid;

    private serviceForm:CyServiceForm;

    private serviceSplitter:CySplitter;
}

export = CyProvisionView;