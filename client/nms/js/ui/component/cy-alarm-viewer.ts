/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../../definitions/i18next.d.ts" />

import CyUtils = require("../../util/cy-utils");
import CyEnums = require("../../util/cy-enums");
import CyTimeline = require("./cy-timeline");
import CyAlarmInfo = require("./cy-alarm-info");
import CyTemplates = require("../../util/cy-templates");
import CySettings = require("../../cy-settings");
import CyAnalytics = require("../../cy-analytics");
import CyWidget = require("./cy-widget");
import CyEvents = require("../../cy-events");
import CyGridComboToolbar = require("../toolbar/cy-grid-combo-toolbar");

interface IPanelScope {
    alarmType: String;
    objects: any[];
    scopeIds: any[];
    filters: any;
}
/**
 * Settings for the entire alarm viewer
 */
interface IAlarmViewerSetting {

    /**
     * List of panels
     * @property panelList
     */
        panelList: IPanelScope[];

    /**
     * Currently selected panel
     * @property activePanel
     */
        activePanel: String;

}

/**
 * Alarm Viewer
 * Organizes multiple alarms into panels and creates a graph for each node.
 *
 * @module CyUI
 * @class CyAlarmViewer
 */
export class CyAlarmViewer extends CyWidget {

    /**
     * panel list element
     * @property {JQuery} panelDiv
     * @private
     */
    private panelDiv:JQuery;

    /**
     * filter options menu
     * @property {kendo.ui.KendoMenu} menu
     * @private
     */
    private menu;

    /**
     * alarm graphs per node
     * @property {Object} alarmGraphs
     * @private
     */
    private alarmGraphs:{ [groupname:string]:AlarmGraph };

    /**
     * kendo panel drop down
     * @property {kendo.ui.kendoDropDownList} panelSelector
     * @private
     */
    private panelSelector:kendo.ui.DropDownList;

    /**
     * panel drop down data source
     * @property {Array} panelSelectorData
     * @private
     */
    private panelSelectorData:kendo.data.DataSource;

    /**
     * saved settings
     * @property {IAlarmViewerSetting} settings
     * @private
     */
    private settings:IAlarmViewerSetting;

    /**
     * filters
     */
    private filters;

    /**
     * initial panel that should be opened on initialization
     * @property {boolean} _initialPanel
     * @private
     */
    private initialPanel:String;

    /**
     * Settings key name for CyAlarmViewer
     * @private
     * @static
     */
    private static kSETTINGS_NAME = 'alarm-viewer';

    /**
     * kendo panel object
     * @property {kendo.ui.PanelBar} panel
     * @private
     */
    public get panel():kendo.ui.PanelBar {

        if (!this.panelDiv) {

            this.panelDiv = this.element.find('.cy-alarm-panels ul');


        }

        return this.panelDiv.data("kendoPanelBar");

    }

    /**
     * return the default time range for a new alarm panel being added
     * @returns {null}
     */
    private get defaultRange() : Date[] {

        // default range is a week

        var end:Date = new Date(Date.now());

        var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 7);

        return [start, end];
    }

    /**
     * @constructor
     * @param {String} settingsKey  the key used in saving settings.
     */
        constructor(private useSettings:boolean = true) {

        super("CyAlarmViewer");

        this.alarmGraphs = {};

    }

    /**
     * constructs the main alarm viewer elements
     * @method buildElement
     * @public
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate('cyan-alarm-window-template');

        var menuDiv = e.find('.menu');

        // handling check with menu select
        // so prevent default click

        menuDiv.find('input').click((e) => {
            this.onFilterSelect(e);
            e.stopPropagation();
        });

        this.menu = menuDiv.kendoMenu({
            select: $.proxy(this.onFilterSelect, this),
            closeOnClick: false
        }).data('kendoMenu');


        // initialize the drop down list

        this.panelSelectorData = new kendo.data.DataSource();

        var panelSelectDiv = e.find('.alarm-panel-selector');

        panelSelectDiv.kendoDropDownList({
            enable: false,
            autoBind: false,
            dataSource: this.panelSelectorData,
            dataTextField: 'label',
            dataValueField: 'key',
            change: $.proxy(this.onPanelSelect, this)
        });

        this.panelSelector = panelSelectDiv.data("kendoDropDownList");

        // sink events to grid buttons

        this.on(CyGridComboToolbar.kVIEWER_CLICKED, (e?:any) => {
            this.viewAlarms(e);
        });

        // find and handle the close all button.

        $('[data-element="close-all-button"]', e).click(() => {

            this.clearPanels();

            this.saveCurrentSettings();

        });

        return e;
    }

    /**
     * Initialize everything from the saved settings
     * @method initializeFromSettings
     * @private
     */
    public initializeFromSettings() {

        // load and initialize viewer from settings

        var defaultSettings:IAlarmViewerSetting = {
            panelList: [],
            activePanel: ''
        };

        // default filters

        this.filters = {
            'Warning': false,
            'Minor': false,
            'Major': false,
            'Critical': false
        };

        // setup default settings

        this.settings = this.useSettings ? CySettings.I.read(CyAlarmViewer.kSETTINGS_NAME, defaultSettings) : defaultSettings;

        // restore previous state from settings

        if (this.useSettings) {


            // restore panel focus
            this.initialPanel = this.settings.activePanel;

            var alarmTypePanels = [], alarmNodePanels = [];

            // restore the alarm panels
            _.each(this.settings.panelList, (panel) => {

                if (panel.alarmType) {

                    alarmTypePanels = alarmTypePanels.concat(panel.objects);

                } else  {

                    alarmNodePanels = alarmNodePanels.concat(panel.objects);

                }

            });

            if (alarmTypePanels.length > 0) {

                this.addAlarms(alarmTypePanels);

            }

            if (alarmNodePanels.length > 0) {

                this.addNodes(alarmNodePanels);

            }
        }
    }

    /**
     * Save current settings as the name implies
     * @method saveCurrentSettings
     * @private
     */
    private saveCurrentSettings() {

        // save the complete state of the viewer
        this.settings.activePanel = this.panelSelector.value();

        this.settings.panelList = [];

        for (var id in this.alarmGraphs)  {

            var scope = _.clone(this.alarmGraphs[id].scope);

            this.settings.panelList.push(scope);

        }

        CySettings.I.write(CyAlarmViewer.kSETTINGS_NAME, this.settings);

    }


    /**
     * View alarms from grid selection
     * @param e
     */
    private viewAlarms(e) {

        if (e.type == "CyNodeGrid" ) {
            this.addNodes(JSON.parse(e.data));
        }

        if (e.type == "CyAlarmGrid" || e.type == "CyAlarmLogGrid") {
            this.addAlarms(JSON.parse(e.data));
        }

    }

    /**
     * Event handler for filter menu select.  This is called for click event on the checkbox and on the kendo menu
     * @method onFilterSelect
     * @param {Object} e
     * @private
     */
    private onFilterSelect(e) {

        var isMenu = e.item !== undefined;

        // find the li in the menu

        var item:JQuery = (isMenu) ? $(e.item) : $(e.target).parent().parent();
        var severity:string = item.attr("severity");

        var input = item.find('input[type="checkbox"]');

        // checkboxes need to be manually toggled

        if (isMenu) {
            if (input.is(":checked")) {
                input.prop('checked', false);
            } else {
                input.prop('checked', true);
            }
        }

        // if user clicks on an item

        if (severity) {

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_ALARM_VIEWER_FILTER_TOGGLED, -1, severity);

            // toggle individual filter

            for (var id in this.alarmGraphs) {

                this.alarmGraphs[id].toggleFilter('severity', severity);

            }

        } else {

            // don't do anything

        }

    }

    /**
     * Event handler for when the panel dropdown changes
     * @method onPanelSelect
     * @param e
     * @private
     */
    private onPanelSelect(e?:any) {

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_ALARM_VIEWER_PANEL_SELECT);

        this.initialPanel = null;

        var key = e.sender.value();

        this.focus(key);

        this.saveCurrentSettings();

    }

    private onPanelBarSelect(e?:any) {

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_ALARM_VIEWER_PANEL_SELECT);

        this.initialPanel = null;

        var key = $(e.item).attr('key');

        this.focusPanelSelect(key);

        this.saveCurrentSettings();

    }
    /**
     * window resize
     * @method resize
     */
    public resize () {

        for (var id in this.alarmGraphs) {

            // ignore height resize for the window but handle width
            this.alarmGraphs[id].resize();

        }

    }



    /**
     * adds a list of node to this viewer
     * @method addNodes
     * @param {Array} nodes
     * @public
     */
    public addNodes(nodes:any[], saveToSettings:boolean = true) {

        if (saveToSettings) {

            this.initialPanel = null;

        }

        _.each(nodes, (node:any) => {

            var key = 'node_' + node.ems_node_id;
            var label = 'Node (' + node.user_label + ')';

            // weird bug where addNodes is called twice from the eventbus

            if (!(key in this.alarmGraphs)) {

                // add panel as list
                // the div is necessary to tell Kendo this is expandable
                this.addPanel(
                    // key
                    key,
                    // label
                    label,
                    // scope
                    {
                        scopeIds: [ node.ems_node_id ],
                        dateRange: this.defaultRange,
                        objects: [ node ],
                        alarmType: null,
                        filters: _.clone(this.filters)
                    });

                this.addToPanelList(label, key);

            }

            this.focus(key);

        });

        if (saveToSettings && this.useSettings) {

            this.saveCurrentSettings();
        }

    }

    /**
     * Adds a panel to the viewer by a given node id or ids
     * @method addNodesById
     * @param nodeIds
     * @public
     */
    public addNodesById(nodeIds) {

        var nodes = nodeIds.join(',');
        $.ajax({
            url: '/api/v1/nodes?node_ids=' + nodes,
            dataType: 'json',
            success: (json) => {

                var objects = <any[]>json.objects;

                this.addNodes(objects);

            }
        });

    }

    /**
     * Adds a multi-node viewer from the given alarms
     * @method addAlarms
     * @param alarms
     * @public
     */
    public addAlarms(alarms:any[], saveToSettings:boolean = true) {

        if (saveToSettings) {

            this.initialPanel = null;

        }

        var commonAlarms = this.groupAlarmTypes(alarms);

        for (var id in commonAlarms) {


            var groupAlarms = commonAlarms[id].alarms;
            var nodes = commonAlarms[id].nodes;

            var key = 'alarm_' + id;
            var label = 'Alarm Type (' + $.t("cyms:probableCause." + CyEnums.CyEnumerations.ProbableCause[id]  ) + ')';

            if (!(key in this.alarmGraphs)) {

                // add panel as list
                // the div is necessary to tell Kendo this is expandable
                this.addPanel(
                    // key
                    key,
                    // label
                    label,
                    // scope
                    {
                        scopeIds: nodes,
                        dateRange: this.defaultRange,
                        objects: groupAlarms,
                        alarmType: id,
                        filters: _.clone(this.filters)
                    });

                this.addToPanelList(label, key);

            } else {

                var scope = _.clone(this.alarmGraphs[key].scope);

                _.each(groupAlarms, function (alarm) {

                    if (!(alarm.node_id in scope.scopeIds)) {

                        scope.scopeIds.push(alarm.node_id);

                    }

                    scope.objects.push(alarm);

                });

                this.updatePanel(
                    // key
                    key,
                    // label
                    label,
                    // scope
                    scope);

            }
        }

        this.focus(key);

        if (saveToSettings && this.useSettings) {

            this.saveCurrentSettings();

        }

    }

    /**
     * Group individual alarms together by prob cause.
     *
     * @method group CyAlarmTypes
     * @param alarms
     * @returns {{}}
     */
    private groupAlarmTypes(alarms:any[]) {

        var groups = {};

        _.each(alarms, function (alarm){

            if (!(alarm.prob_cause in groups))  {
                groups[alarm.prob_cause] = { alarms: [], nodes: [] };
            }

            groups[alarm.prob_cause].alarms.push(alarm);

            if (!(alarm.node_id in groups[alarm.prob_cause].nodes)) {
                groups[alarm.prob_cause].nodes.push(alarm.node_id);
            }

        });

        return groups;
    }

    /**
     * Clear all panels from the viewer
     * @method clearPanels
     * @public
     */
    public clearPanels() {

        var panel = <any>this.panel;

        if (panel) {

            panel.element.children().each((index, item) => {

                this.closePanel($(item));

            });
        }

    }

    /**
     * Initializes the kendo panel
     * @method initPanels
     * @public
     */
    private initPanels() {

        this.panelDiv.kendoPanelBar({
            select: $.proxy(this.onPanelBarSelect, this)
        });
    }

    /**
     * adds alarm/node type graph to the Kendo UI PanelBar
     * @method addPanel
     * @param {Object} graphType
     * @returns {JQuery} the panel content
     * @private
     */
    private addPanel(key, label, scope):JQuery {

        // track panel opened

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_ALARM_VIEWER_PANEL_OPENED);

        if (!this.panel) {

            this.initPanels();
        }

        // kendo typescript defs aren't correct for panel
        // so I'm casting it to any

        var panel = <any>this.panel;

        var item;

        var headerTemplate = CyTemplates.compileTemplate('cyan-alarm-panel-header-template');

        panel.append({
            text: headerTemplate({ label: label }),
            encoded: false,
            expanded: true,
            content: "<div></div>"
        });

        item = panel.element.children("li:last").attr('key', key);

        // handle close event

        item.find('.alarm-viewer-close').click((e) => {

            this.closePanel(item);
            this.saveCurrentSettings();
            e.stopPropagation();

        });

        this.alarmGraphs[key] = new AlarmGraph(this, scope);

        this.alarmGraphs[key].element.appendTo($('.k-content', item).empty());

        this.alarmGraphs[key].datasource.read();

        return item;
    }

    /**
     * Updates the panel with the new label and scope
     * @method updatePanel
     * @param key
     * @param label
     * @param scope
     * @private
     */
    private updatePanel(key, label, scope) {

        this.alarmGraphs[key].scope = scope;
        this.alarmGraphs[key].datasource.read();
    }

    /**
     * Finds a specific panel item
     * @param key
     * @returns {JQuery}
     */
    private findPanel(key) {

        if (this.panel) {
            return this.panel.element.children('[key="' + key + '"]');
        }

        return null;
    }

    /**
     * Forces the scrollTop to show the item and sets the focus
     * @method focus
     * @private
     */
    private focus(key) {

        var panel = <any>this.panel;

        var parent = this.panelDiv.parent();

        if (this.initialPanel) {

            key = this.initialPanel;

        }

        var item = this.findPanel(key);

        if (item && item.length > 0) {

            // bring panel in focus and expand
            panel.select(item);
            panel.expand(item);

            // change the selector value
            this.focusPanelSelect(key);

            parent.scrollTop(item.position().top);

        }
    }

    /**
     * Changes the value of the panel dropdown selector
     * @method forcePanelSelect
     * @param {String} key
     * @private
     */
    private focusPanelSelect(key) {

        var panelSel = <any>this.panelSelector;

        panelSel.value(key);
    }

    /**
     * removes an item from the panel
     * @method closePanel
     * @param {JQuery} item panel content selector
     * @private
     */
    private closePanel(item) {

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kANALYTICS_ALARM_VIEWER_PANEL_CLOSED);

        // kendo typescript defs aren't correct for panel
        // so I'm casting it to any

        var panel = <any>this.panel;
        var key = item.attr('key');

        panel.remove(item);

        // clean up widget

        CyWidget.disposeTree(this.alarmGraphs[key].element);

        // clear key so it can be added again

        delete this.alarmGraphs[key];

        this.removeFromPanelList(key);

        if (Object.keys(this.alarmGraphs).length == 0) {

            this.destroyPanels();

        }

    }

    /**
     * clean up
     * @method dispose
     * @public
     */
    public dispose() {

        this.clearPanels();

    }

    /**
     * clean up kendo panels
     * @method destroyPanels
     * @public
     */
    public destroyPanels() {

        if (this.panel) {
            this.panel.destroy();
        }

    }

    /**
     * add to panel selector
     * @method addToPanelList
     * @param label
     * @param key
     * @private
     */
    private addToPanelList(label:string, key:string):void {

        var panelSel = <any> this.panelSelector;

        this.panelSelectorData.add({ label: label, key: key });

        panelSel.refresh();
        panelSel.enable(true);

    }

    /**
     * remove from the panel list
     * @method removeFromPanelList
     * @param key
     * @private
     */
    private removeFromPanelList(key:string):void  {

        var panelSel = <any> this.panelSelector;

        var data = this.panelSelectorData.data();

        for (var i = 0, l = data.length; i < l; ++i) {

            if (data[i].key === key) {

                this.panelSelectorData.remove(data[i]);
                panelSel.text('');
                panelSel.refresh();

                if (l == 1) {
                    panelSel.enable(false);
                }
                break;
            }
        }

    }

}

/**
 * AlarmGraph
 * Spits out the graph into a panel by using D3.
 * @module CyUI
 * @class AlarmGraph
 */
export class AlarmGraph extends CyWidget {

    /**
     * the owner of this class
     * @property {CyUI.CyAlarmViewer} owner
     * @private
     */
    private owner:CyAlarmViewer;

    /**
     * The current filter set for the alarms data
     * @property {Object} _scope
     * @private
     */
    private _scope:any;

    /**
     * Getter for scope
     * @property {Object} scope
     * @public
     */
    public get scope():any {

        return this._scope;

    }

    /**
     * Setter for scope
     * @property {Object} scope
     * @param value
     * @public
     */
    public set scope(value : any) {

        this._scope = value;

    }

    /**
     * the alarm data
     * @property {Array} alarms
     * @private
     */
    private alarms;

    /**
     * the labels
     * @property {Array} groups
     * @private
     */
    private groups;

    /**
     * category map
     * @property {Object} categories
     * @private
     */
    private categories;

    /**
     * the timeline instance
     * @property {CyUI.Component.CyTimeline} timeline
     * @private
     */
    private timeline;

    /**
     * handle to the tooltip element
     * @property {JQuery} tooltip
     * @private
     */
    private tooltip;

    /**
     * the historical logs data source
     * @property {kendo.data.DataSource} datasource
     * @private
     */
    private _datasource;
    public get datasource() : kendo.data.DataSource {

        return this._datasource;
    }

    /**
     * margins for the graph
     * @property {Object} margin
     * @private
     */
    private margin;

    /**
     * minimum date from all the alarms
     * @property {Date} _minDate
     * @private
     */
    private _minDate:Date;

    /**
     * getter for minDate
     * @property {Date} minDate
     * @returns {Date}
     * @public
     */
    public get minDate():Date {
        return this._minDate;
    }

    /**
     * maximum date from all the alarms
     * @property {Date} _maxDate
     * @private
     */
    private _maxDate:Date;

    /**
     * getter for maxDate
     * @property {Date} maxDate
     * @returns {Date}
     * @public
     */
    public get maxDate():Date {
        return this._maxDate;
    }

    /**
     * handler IDs
     * @property {CyCore.CyEvents.EventIDList} eventTokens
     * @private
     */
    private eventTokens:CyEvents.EventIDList;



    /**
     * a map of severity types to class names
     * @property {Object} severityTypes
     * @public
     * @static
     */
    public static severityTypes = {
        "Indeterminate": "alarm-severity-indeterminate",
        "NonAlarmed": "alarm-severity-non-alarmed",
        "Free_Choice": "alarm-severity-free-choice",
        "Warning": "alarm-severity-warning",
        "Minor": "alarm-severity-minor",
        "Major": "alarm-severity-major",
        "Critical": "alarm-severity-critical",
        "Cleared": "alarm-severity-cleared"
    };

    /**
     * @constructor
     * @param {CyUI.CyAlarmViewer} owner the alarm viewer that created this
     */
        constructor(owner:CyAlarmViewer,
                    scope:any) {

        super("AlarmGraph");

        this.owner = owner;

        this._scope = scope;

        this.alarms = [];

        this.groups = [];

        this.categories = {};

        this.margin = {
            left: 150,
            right: 20,
            top: 20,
            bottom: 25
        };


        this._datasource = this.alarmDataSource;
        this._datasource.bind("change", $.proxy(this.onDataChange, this));


        this.eventTokens = new CyEvents.EventIDList(this.eventBus);

        this.eventTokens.add(this.on(CyAlarmInfo.kCLICKED, (e?:any) => {
            this.toggleFilter('severity', e.severity);
        }));

    }

    public buildElement() : JQuery {

        // build container for the graph

        var div = CyTemplates.cloneTemplate('cyan-alarm-graph-template');

        this.tooltip = div.find('.cyan-tooltip');

        // build the graph

        this.timeline = new CyTimeline(this);

        // swap out the event bus

        this.timeline.eventBus = this.owner.eventBus;

        // hide/show classes

        _.each(this.scope.filters, (filtered, key?)  => {

            var cssclass = AlarmGraph.severityTypes[key];

            if (filtered) {
                this.timeline.hideClass(cssclass);
            } else {
                this.timeline.showClass(cssclass);
            }

        });

        this.timeline.element.appendTo(div);

        return div;
    }

    public onDataChange(e?:any) {

        this.update(this.datasource.data());

    }

    /**
     * update the date range and reload from datasource
     * @param range
     */
    public updateDateRange(range:Array) : void {

        this.scope.dateRange = range;

        this.datasource.read();
    }

    /**
     * Toggles the current filter options
     * @method toggleFilter
     * @param {String} filterType
     * @param {String} filterKey
     * @public
     */
    public toggleFilter(filterType, filterKey) {

        if (filterType === 'severity') {
            var filter = this._scope.filters[filterKey] = !this._scope.filters[filterKey];
            var cssclass = AlarmGraph.severityTypes[filterKey];

            if (filter) {
                this.timeline.hideClass(cssclass);
            } else {
                this.timeline.showClass(cssclass);
            }
        }

    }

    /**
     * Clears the graphs data
     * @method clear
     * @public
     */
    public clear() {

        this.categories = {};
        this.groups = [];
        this.alarms = [];

    }

    /**
     * Determines if the event should be filtered
     * @method filtered
     * @param event
     * @returns {boolean}
     * @public
     */
    public filtered(event) {

        var filter = false;

        if (this._scope.alarmType && this._scope.alarmType != event.prob_cause) {

            filter = true;

        }

        return filter;

    }

    /**
     * update our list of alarms by iterating through each event
     * and building individual alarms events from the state changes
     * @method update
     * @param {Array} logs
     * @public
     */
    public update(logs) {

        this.clear();

        _.each(logs, (event) => {

            this.addAlarm(  event.id,
                            event.node_id,
                            this.getLabelForEvent(event),
                            new Date(event.start_date * 1000),
                            new Date(event.end_date * 1000),
                            event.severity,
                            event.add_text,
                            event.prob_cause_label);

        });

        this.timeline.replaceElements(this.alarms);

    }

    /**
     * Construct the label name from event properties
     * @method getLabelForEvent
     * @param event
     * @returns {*}
     * @private
     */
    private getLabelForEvent(event:any) : string {

        var label;
        var source = event.me_name.replace('OID_CLASS', '');

        // this is a single node alarm graph
        if (!this._scope.alarmType) {
            label = event.me_name.replace('OID_CLASS_', '');
        } else {
            label = event.node_name + ':' + source;
        }

        return label;
    }

    /**
     * Adds an alarm to the list
     * @method addAlarm
     * @param {Number} id
     * @param {Number} nodeId
     * @param {String} label
     * @param {Date} startTime
     * @param {Date} endTime
     * @param {Number} severity
     * @param {String} text
     * @param {String} probable cause of alarm
     * @private
     */
    private addAlarm(id, nodeId, label, startTime, endTime, severity, text, probcause) {

        /** setup alarm list **/
        this.alarms.push({
            text        : text,
            id          : label,
            severity    : CyEnums.CyEnumerations.AlarmSeverity[severity],
            cssclass    : AlarmGraph.severityTypes[CyEnums.CyEnumerations.AlarmSeverity[severity]],
            start       : startTime,
            end         : endTime,
            probcause   : probcause
        });
    }

    /**
     * tells our graph to resize itself
     * @method resize
     * @public
     */
    public resize () {

        this.timeline.resize();

    }

    /**
     * Destroys the graph
     * @method destroy
     * @public
     */
    public dispose() {

        this.eventTokens.allOff();

    }

    private get alarmDataSource() : kendo.data.DataSource {

        var datasource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: $.proxy(this.prepareRequest, this),
                    dataType: "json"
                }
            },
            //group: [ { field: 'id' } ],
            schema: {
                data: function (response:any):any {
                    return response.objects;
                }
            },
            serverFiltering: true
        });

        return datasource;
    }

    public prepareRequest(e) {

        var startDate = Math.floor(this.scope.dateRange[0].getTime()/1000);

        var endDate = Math.floor(this.scope.dateRange[1].getTime()/1000);

        e.scope_ids = this.scope.scopeIds.join(',');

        e.start_date = startDate;

        e.end_date = endDate;

        e.count=300;

        return "/api/v1/alarmEvents"; // /api/v1/alarms/logs";

    }



    /**
     * triggered when the alarm bar is clicked
     * @event
     * @public
     * @static
     */
    public static kALARM_CLICKED = 'cy-alarm-graph-alarm-clicked';

}
