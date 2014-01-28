/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />


import CyApp = require("../../cy-app");
import CyEvents = require("../../cy-events");
import CySocketManager = require("../../cy-socket-manager");
import CyUtils = require("../../util/cy-utils");
import CyTemplates = require("../../util/cy-templates");
import CySplitter = require("../component/cy-splitter");
import CyTab = require("../component/cy-tab");
import CyIFrame = require("../component/cy-iframe");
import CyTrailGrid = require("../grid/cy-trail-grid");
import CyLinkGrid = require("../grid/cy-link-grid");
import CyNodeGrid = require("../grid/cy-node-grid");
import CyGrid = require("../grid/cy-grid");
import CyAffectedServicesWindow = require("../window/cy-affected-services-window");
import CyAlarmViewerWindow = require("../window/cy-alarm-viewer-window");
import CyView = require("./cy-view");
import CySettings = require("../../cy-settings");
import CyAnalytics = require("../../cy-analytics");
import CyWindow = require("../window/cy-window");
import CyDialog = require("../window/cy-dialog");
import CyWindowManager = require("../window/cy-window-manager");
import CyNodeSelector = require("../window/cy-node-selector");
import CyGridComboToolbar = require("../toolbar/cy-grid-combo-toolbar");

/**
 * this is view within the app class. It has nothing to do with the model-view paradigm
 * @class CyMainView
 */
class CyMainView extends CyView {

    /**
     * Construct Cyan Main View
     *
     * @class CyMainView
     * @constructor
     */

        constructor() {

        // super first as required

        super("CyMainView");

    }

    /**
     * initialize view, called from base class
     */
    public buildElement():JQuery {

        this.eventTokens = new CyEvents.EventIDList(CyApp.I.eventBus);

        // Create a split view

        var e:JQuery = this.createRootView();

        // create object for listening to alarm sockets calls

        this._socketManager = new CySocketManager();

        // sink grid events

        this.eventTokens.add(CyApp.I.eventBus.on(CyGridComboToolbar.kAFFECTED_TRAILS_CLICKED, (e?:any) => {
            switch (e.type) {
                case "CyTrailGrid":
                    this.viewAffectedByTrails(e);
                    break;
                case "CyLinkGrid":
                    this.viewAffectedByLinks(e);
                    break;
                case "CyNodeGrid":
                    this.viewAffectedByNodes(e);
                    break;
            }
        }));

        this.eventTokens.add(CyApp.I.eventBus.on(CyGridComboToolbar.kCOPY_TO_CLIPBOARD, (e?:any) => {
//            switch (e.type) {
//
//                case "CyTrailGrid":
//
//                    break;
//                case "CyLinkGrid":
//
//                    break;
//                case "CyNodeGrid":
//
//                    CyDialog.textDialog("Selected Rows - CSV", CyGrid.selectionsToCSV(e.data), CyDialog.kMODAL_OK);
//
//                    break;
//            }

            CyDialog.textDialog("Selected Rows - CSV", CyGrid.selectionsToCSV(e.data), CyDialog.kMODAL_OK);

        }));

        // show navigation headers relative to this view

        CyApp.I.showNavigationHeaders();

        // select the default tab

        this.selectDefaultTab();

        // return outer selector

        return e;

    }

    /**
     * lookup for tracking event subscriptions to the main event bus
     * @type {{}}
     */
    private eventTokens:CyEvents.EventIDList;

    /**
     * the root split view
     * @type {Array}
     * @private
     */
    private _rootView:CySplitter;
    public get rootView():CySplitter {
        return this._rootView;
    }

    /**
     * the bottom tab view
     * @type {Array}
     * @private
     */
    private _bottomTabView:CyTab.CyTabPanel;
    public get bottomTabView():CyTab.CyTabPanel {
        return this._bottomTabView;
    }

    /**
     * tab containing the nodes
     */
    private _nodeTab:CyTab.CyTabPage;

    /**
     * alarm tabs
     */
    private _alarmTab:CyTab.CyTabPage;

    /**
     * tab containing the links
     */
    private _linkTab:CyTab.CyTabPage;

    /**
     * trails tabs
     */
    private _trailTab:CyTab.CyTabPage;

    /**
     * logs tabs
     */
    private _alarmlogTab:CyTab.CyTabPage;


    /**
     * grid node
     */
    private _nodeGrid:CyIFrame;
    public get nodeGrid():CyIFrame {
        return this._nodeGrid;
    }

    /**
     * alarm grid within
     */
    private _alarmGrid:CyIFrame;
    public get alarmGrid():CyIFrame {
        return this._alarmGrid;
    }

    /**
     * grid link
     */
    private _linkGrid:CyIFrame;
    public get linkGrid():CyIFrame {
        return this._linkGrid;
    }

    /**
     * trail grid within
     */
    private _trailGrid:CyIFrame;
    public get trailGrid():CyIFrame {
        return this._trailGrid;
    }

    /**
     * alarm log grid
     */
    private _logGrid:CyIFrame;
    public get logGrid():CyIFrame {
        return this._logGrid;
    }

    /**
     * alarm viewer
     */
    private _alarmViewer:CyIFrame;
    public get alarmViewer():CyIFrame {
        return this._alarmViewer;
    }

    /**
     * web socket manager for alarms
     */
    private _socketManager:CySocketManager;

    /**
     * create the split window
     */

    private createRootView():JQuery {

        var viewContainer:JQuery = CyTemplates.cloneTemplate('cyan-split-view-container-template').appendTo(CyTemplates.content);

        this._rootView = new CySplitter(this, null, viewContainer, 'root', 'vertical');

        this.rootView.append('cy-top-view');

        this.rootView.append('cy-bottom-view', {
            size: '50%',
            collapsible: false
        });


        // create the top tab view

        var topTabContainer = this.rootView.children[0].element;

        this.openAlarmViewer(topTabContainer);

        // create the bottom tab view

        this._bottomTabView = new CyTab.CyTabPanel();

        // inject the master event bus into the tab window so its events become global

        this._bottomTabView.eventBus = CyApp.I.eventBus;

        // append to split view

        this._bottomTabView.element.appendTo(this.rootView.children[1].element);

        // create node tab

        this._nodeTab = this.bottomTabView.addTab("Nodes");

        // create alarms tab

        this._alarmTab = this.bottomTabView.addTab("Alarms");

        // create link tab

        this._linkTab = this.bottomTabView.addTab("Links");

        // create trails tab

        this._trailTab = this.bottomTabView.addTab("Trails");

        // create alarm log tab

        this._alarmlogTab = this.bottomTabView.addTab("Logs");

        // sink events on tabs so we can lazily create the content for this

        this.eventTokens.add(CyApp.I.eventBus.on(CyTab.CyTabPage.kTAB_OPENED, $.proxy(this.tabOpened, this)));

        // size tab content when selected

        this.eventTokens.add(CyApp.I.eventBus.on(CySplitter.kSPLIT_VIEW_RESIZED, $.proxy(this.onResize, this)));

        // size tab content when tab selection changed

        this.eventTokens.add(CyApp.I.eventBus.on(CyTab.CyTabPage.kTAB_SELECTED, $.proxy(this.onTabSelected, this)));

        // return the outer element

        return viewContainer;
    }


    private onTabSelected(e?:any):void {

        if (e.tab === this._alarmTab) {

            this._socketManager.pollAlarms();

        } else {

            this._socketManager.stopAlarms();

        }

        // remember the selected tab

        if (e.tab === this._nodeTab) {

            CySettings.I.write("main-bottom-view-tab", "nodes");
        }

        if (e.tab === this._alarmTab) {

            CySettings.I.write("main-bottom-view-tab", "alarms");
        }

        if (e.tab === this._linkTab) {

            CySettings.I.write("main-bottom-view-tab", "links");
        }

        if (e.tab === this._trailTab) {

            CySettings.I.write("main-bottom-view-tab", "trails");
        }

        if (e.tab === this._alarmlogTab) {

            CySettings.I.write("main-bottom-view-tab", "alarm-logs");
        }

        this.sizeTabContent(e);

    }

    /**
     * when one of the tabs is opened for the first time
     * @param sender
     */
    private tabOpened(e?:any):void {


        // create node grid on demand

        if (e.tab === this._nodeTab) {

            // create, config node grid and add as a tab

            this._nodeGrid = new CyIFrame('/framednodegrid', {

                width: '100%',

                height: '100%'

            });


            this._nodeGrid.eventBus = CyApp.I.eventBus;

            this._nodeGrid.element.appendTo(this._nodeTab.content);



        }

        if (e.tab === this._alarmTab) {

            // create alarm grid in its tab

            this._alarmGrid = new CyIFrame('/framedalarmgrid', {

                width: '100%',

                height: '100%'

            });


            this._alarmGrid.eventBus = CyApp.I.eventBus;

            this._alarmGrid.element.appendTo(this._alarmTab.content);

        }

        if (e.tab === this._linkTab) {
            // create, config node grid and add as a tab

            this._linkGrid = new CyIFrame('/framedlinkgrid', {

                width: '100%',

                height: '100%'

            });


            this._linkGrid.eventBus = CyApp.I.eventBus;

            this._linkGrid.element.appendTo(this._linkTab.content);
        }

        if (e.tab === this._trailTab) {
            // create, config node grid and add as a tab

            this._trailGrid = new CyIFrame('/framedtrailgrid', {

                width: '100%',

                height: '100%'

            });


            this._trailGrid.eventBus = CyApp.I.eventBus;

            this._trailGrid.element.appendTo(this._trailTab.content);
        }

        if (e.tab === this._alarmlogTab) {
            // create, config node grid and add as a tab

            this._logGrid = new CyIFrame('/framedloggrid', {

                width: '100%',

                height: '100%'

            });


            this._logGrid.eventBus = CyApp.I.eventBus;

            this._logGrid.element.appendTo(this._alarmlogTab.content);
        }

    }

    /**
     * when the browser is resized
     * @param e
     */
    private onResize(e?:any):void {

        this.sizeTabContent(e);

    }

    /**
     * select the default tab from the settings object
     */
    private selectDefaultTab():void {

        var bottomTab = CySettings.I.read("main-bottom-view-tab", "nodes");

        switch (bottomTab) {

            case "nodes" :
            {

                this.bottomTabView.selectTab(this._nodeTab);

            }
                break;

            case "alarms" :
            {

                this.bottomTabView.selectTab(this._alarmTab);

            }
                break;

            case "links" :
            {

                this.bottomTabView.selectTab(this._linkTab);

            }
                break;

            case "trails" :
            {

                this.bottomTabView.selectTab(this._trailTab);

            }
                break;

            case "alarm-logs" :
            {

                this.bottomTabView.selectTab(this._alarmlogTab);

            }
                break;
        }

    }

    /**
     * this should be called whenever the window is resized OR a tab becomes selected / visible.
     * Resizing hidden tabs doesn't work reliably so this has to be called on visible tabs only.
     * @param window
     */
    private sizeTabContent(e?:any):void {

    }


    /**
     * Creates an alarm viewer when needed
     * @method openAlarmViewer
     * @param element
     * @private
     */
    private openAlarmViewer(element:JQuery) {

        if (!this._alarmViewer) {

            // create new alarm viewer widget

            this._alarmViewer = new CyIFrame();

            this._alarmViewer.element.css({
                width: "100%",
                height: "100%"
            });
            this._alarmViewer.src = "/framedalarmviewer";

            // construct the element and dynamically size it

            this._alarmViewer.element.appendTo(element);

        }
    }

    /**
     * Opens affected services window from the affected trails
     * @method viewAffectedByTrails
     * @param e
     * @private
     */
    private viewAffectedByTrails(e?:any):void {

        this.createAffectedServicesWindow('trail', JSON.parse(e.data));

    }

    /**
     * Opens affected services window from the affect nodes
     * @method viewAffectedByNodes
     * @param e
     * @private
     */
    private viewAffectedByNodes(e?:any):void {

        this.createAffectedServicesWindow('node', JSON.parse(e.data));

    }

    /**
     * Opens affected services window from the affected links
     * viewAffectedByLinks
     * @param e
     * @private
     */
    private viewAffectedByLinks(e?:any):void {

        this.createAffectedServicesWindow('link', JSON.parse(e.data));

    }

    /**
     * Creates a new affected services window
     * @method createAffectedServicesWindow
     * @param type
     * @param selections
     * @private
     */
    private createAffectedServicesWindow(type, selections) {

        var key;

        if (selections.length == 0 || selections.length > 1) {
            return;
        }

        switch (type) {
            case 'trail':
                key = selections[0].name;
                break;
            case 'node':
                key = selections[0].ems_node_id;
                break;
            case 'link':
                key = selections[0].name;
        }

        // track it

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kAFFECTED_SERVICES_WINDOW_OPENED);

        // create window

        var w:CyWindow = new CyAffectedServicesWindow(type, key);

        w.on(CyWindow.kEVENT_RESIZED, (e?:any) => {

            this.windowClosed(e.sender);
        });

        // remember window

        this.windows.push(w);

    }

    /**
     * when a window is closed
     * @param e
     */
    private windowClosed(e:any):void {

        // get node window

        var w:CyWindow = e.sender;

        // remove from our list

        this.windows.splice(this.windows.indexOf(w), 1);

    }


    /**
     * create the alarm window
     */
    private createAlarmViewer():void {

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_ALARM_GRID_OPENED);

        // create new window

        new CyAlarmViewerWindow();

    }

    /**
     * windows containing node window
     */
    private windows:CyWindow[] = [];


    /**
     * dispose the view, clean up, remove event handlers etc etc
     */
    public dispose():void {

        // close all windows

        _.each(CyWindowManager.I.getWindowsOfType(), (window:CyWindow) => {

            // close

            window.close();

        });

        // unsink all primary event bus events

        if (this.eventTokens) {
            this.eventTokens.allOff();
        }

        // destroy the socket manager

        if (this._socketManager) {
            this._socketManager.destroy();
        }
    }
}

export = CyMainView;

