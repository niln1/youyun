/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../interface/i-cy-grid-state.d.ts" />

import CyWidget = require("../component/cy-widget");
import CyUtils = require("../../util/cy-utils");
import CyToolbar = require("../toolbar/cy-toolbar");
import CyTemplates = require("../../util/cy-templates");
import CyConnector = require("../../data/connectors/cy-connector");
import CyMessage = require("../../cy-message");

/**
 * General behavior for all grid layouts.  The constructor can optionally take a gridConfig so you can dynamically
 * create a custom grid, or you can extend this and override default configs.  The default behavior provides a filter
 * command in the toolbar and some dummy data.  If you supply "filter" as an element to the toolbar array, you will
 * see a default filter.  The default filter is fine in most cases but you can replace this toolbar property with
 * a template.
 */
class CyGrid extends CyWidget {

    /**
     * Builds the grid
     * @param connector     data source connector
     * @param gridConfig    optional grid options that will override the default options
     */
    constructor(className : string, connector : CyConnector, gridConfig?:kendo.ui.GridOptions) {

        super(className);

        this.connector = connector;

        var options = this.baseGridConfig;

        _.extend(options, gridConfig);

        options.dataSource = connector.dataSource;

        this.gridConfig = options;

    }

    public buildElement() : JQuery {

        // create the div that will become the grid. Kendo applies a high z-index to grids for some reason
        // so we lower it again

        var e = $('<div class="reset-z"></div>');

        e.kendoGrid(this.gridConfig);

        // kendo doesn't handle double click events out of the box
        e.on("dblclick", "tr.k-state-selected", () => {

            this.trigger(CyMessage.kGRID_SELECTION_DBLCLICKED, {
                sender: this,
                selections: this.selections[0]
            });
        });

        return e;

    }

    // Pass through for the connector page size properties

    public set pageSize(value : number) {

        this._connector.pageSize = value;
    }

    public get pageSize() : number {
        return this._connector.pageSize;
    }

    /**
     * Fetch the data initially when the grid gets added to the DOM
     */
    public addedToDOM() : void {

        this._connector.read();

    }

    /**
     * cause the current page to reload, or if specified reload the given page.
     * If you just want to update the current page call refresh(), if you have changed
     * some sort of filter etc then call refresh(1) to ensure that a read occurs and the page is reset
     * to the first one.
     *
     * NOTE: Page is one based not zero based.
     *
     * @param page
     */
    public reload(page?:number):void {

        if (page) {

            // page specified so use it

            CyUtils.assert(page >= 1, "Invalid page number");

            // set explicit page, which causes a refresh

            this.grid.dataSource.page(page);

        } else {

            // page not specified

            this.grid.dataSource.read();
        }
    }

    /**
     * Destroys the grid an any other element of this widget
     */
    public dispose():void {

        this.grid.destroy();

        super.dispose();
    }

    /**
     * Event handler for when the grid selection has changed
     * @param e
     */
    public onSelectionChanged(e?:any):void {

        this.trigger(CyGrid.kSELECTION_CHANGED, {
            sender: this,
            selections: this.selections
        });
    }

    /**
     * Event handler for when the grid data source is updated
     */
    public onDataSourceChange(e?:any):void {

        // reset selection since the grid doesn't send a selection change event when paging for example

        this.trigger(CyGrid.kSELECTION_CHANGED, {
            sender: this,
            selections: []
        });

        // trigger data source change event

        this.trigger(CyGrid.kDATA_SOURCE_CHANGED, {
            sender: this,
            data: this.grid.dataSource.data()
        });

    }

    /**
     * Provides the default grid config.
     * @returns {kendo.ui.GridOptions}
     */
    public get baseGridConfig():kendo.ui.GridOptions {

        // default grid config
        return {
            navigatable: true,
            selectable : true,
            reorderable: true,
            resizable  : true,
            columnMenu : true,
            sortable   : {
                mode: "single",
                allowUnsort: false
            },
            filterable : false,
            autoBind: false,
            pageable   : {
                refresh  : false,
                pageSizes: CyGrid.defaultPageSizes
            },
            columns    : this.gridColumns,
            change: $.proxy(this.onSelectionChanged, this)
        }
    }

    /**
     * default selection of items per page
     */
    public static defaultPageSizes:number[] = [10, 25, 50, 100, 250, 500];

    /**
     * Provides the default grid columns.  This was meant to be overridden.
     * @returns {kendo.ui.GridColumn[]}
     */
    public get gridColumns():kendo.ui.GridColumn[] {
        return [
            { field: 'default_field', title: 'Default Field', hidden: true }
        ];
    }


    /**
     * return the current selected rows/cells of the grid
     */
    public get selections():string[] {

        var list:string[] = [];

        for (var i = 0; i < this.grid.select().length; i += 1) {

            var selector:HTMLElement = this.grid.select()[i];

            var item:any = this.grid.dataItem(selector);

            list.push(item);
        }

        return list;
    }

    /**
     * return the kendo grid object for simplified access to the API
     * @returns {JQuery|*}
     */
    public get grid():kendo.ui.Grid {

        return this.element.data("kendoGrid");
    }

    /**
     * return the state of the grid so it can be saved somewhere
     */
    public get state():CyGridState {

        // build list of visible columns and order

        var columnVisibility = [];

        _.each(this.grid.columns, (element:any, index?:number, list?:any) => {
            columnVisibility.push({
                field : element.field,
                hidden: element.hidden,
                index : index
            });
        });

        // get data source from nodegrid

        var dataSource:kendo.data.DataSource = this.grid.dataSource;

        // save settings

        return {
            page    : dataSource.page(),
            pageSize: dataSource.pageSize(),
            sort    : dataSource.sort(),
            group   : dataSource.group(),
            filter  : dataSource.filter(),
            columns : columnVisibility
        }
    }

    /**
     * set the state of the grid from the state object ( produced by the getter above )
     * @param s
     */
    public set state(s:CyGridState) {

        // page and page size are always present

        var dataSource:kendo.data.DataSource = this.grid.dataSource;

        dataSource.page(s.page);

        dataSource.pageSize(s.pageSize);

        // set column visibility and order

        _.each(s.columns, (c) => {

            if (c.hidden) {
                this.grid.hideColumn(c.field);
            } else {
                this.grid.showColumn(c.field);
            }

            // we must find the actual column object to change the order

            var col:any = _.find(this.grid.columns, (temp) => {
                return temp.field === c.field;
            });

            if (col) {
                this.grid.reorderColumn(c.index, col);
            }

        });

        // set optional fields ( optional because if the user hasn't sorted or filtered the grid they won't be persisted )

        if (s.sort) {
            dataSource.sort(s.sort);
        }

        if (s.group) {
            dataSource.group(s.group);
        }

        if (s.filter) {
            dataSource.filter(s.filter);
        }
    }

    /**
     * set the height of the grid. This can be used when the grid is contained in a resizable element.
     * Using a CSS width of 100% works fine for the other axis
     * NOTE: This is fairly tricky to resize the nodegrid in Kendo...this is a fiddle created by their
     * tech support for just that purpose and from which the code below was taken:
     *
     * http://jsfiddle.net/dimodi/4eNu4/2/
     * ( http://www.kendoui.com/forums/kendo-ui-web/nodegrid/dynamic-nodegrid-height.aspx )
     *
     * @param h
     */
    public setGridHeight(h:number):void {

        var dataArea = this.element.find(".k-grid-content");

        var newHeight = this.element.parent().innerHeight() - 2;

        var diff = this.element.innerHeight() - dataArea.innerHeight();

        this.element.height(newHeight);

        dataArea.height(newHeight - diff);
    }

    private height:number;

    public refresh():void {

        this.grid.dataSource.read();

    }

    /**
     * Internal reference to grid options
     */
    private gridConfig:kendo.ui.GridOptions;

    /**
     * filtering a grid should cause the grid
     * to reload
     * @param value
     */
    public set filter(value : string) {

        this.connector.filter = value;
        this.reload(0);
    }

    /**
     * Grid toolbar
     */
    private _toolbar:CyToolbar;

    public get toolbar():CyToolbar {
        return this._toolbar;
    }

    /**
     * Assigns a toolbar to the grid and perform any initialization on the toolbar
     * @param toolbar
     */
    public set toolbar(toolbar:CyToolbar) {

        this._toolbar = toolbar;
        this._toolbar.element.prependTo(this.grid.wrapper);

        this._toolbar.register(this);

        // Hack necessary to get Kendo to recognize new toolbar after initialization

        this.grid.options.toolbar = toolbar.element;
    }

    /**
     * Connector accessors
     */
    private _connector:CyConnector;
    public get connector() : CyConnector {
        return this._connector;
    }
    public set connector(value : CyConnector) {
        this._connector = value;
        this._connector.eventBus = this.eventBus;
    }

    /**
     * Triggered when the grid change event occurs
     * @event kSELECTION_CHANGED
     */
    public static kSELECTION_CHANGED = 'cyan-grid-selection-changed';

    /**
     * Triggered when the grid data source changes
     * @event kDATA_SOURCE_CHANGED
     */
    public static kDATA_SOURCE_CHANGED = 'cyan-grid-data-source-changed';

    /**
     * turn the given rows into CSV. The rows should match the format returned by CyGrid.selections
     * @param o
     */
    public static selectionsToCSV(rows:string):string {

        /* input format expected ( of course the names and quantity of keys can vary ):

         [
         {
         'ne_type'                  : 4,
         'weight'                   : 0,
         'loc_address'              : ' ',
         'location_x'               : 0,
         'location_y'               : 0,
         'communication_state'      : 0,
         'owner'                    : '',
         'alarm_status'             : 0,
         'sw_build_version'         : '131104082931',
         'ea_server_port'           : 60100,
         'port'                     : 8888,
         'ems_node_id'              : 11395,
         'ems_name'                 : '',
         'supported_rates'          : [1, 10000, 10006, 87, 96, 49, 40, 105, 108, 47, 113],
         'alarm_status_label'       : 'Cleared',
         'ea_server_ip'             : '127.0.0.1',
         'ems_in_sync_state_label'  : 'Yes',
         'latitude'                 : ' ',
         'user_label'               : 'cy-petlab-row-e',
         'type_group'               : 1,
         'cllicode'                 : ' ',
         'communication_state_label': 'Available',
         'ems_in_sync_state'        : true,
         'ip_address'               : '10.3.8.3',
         'node_sub_type_name'       : '',
         'sw_version'               : '5.2.01',
         'multi_node_group'         : null,
         '__name'                   : 'nw_node',
         'node_sub_type'            : 0,
         'longitude'                : ' ',
         'resolved_ip_address'      : '10.3.8.3',
         'node_system_id'           : 629216858
         },
         {
         'ne_type'                  : 1,
         'weight'                   : 0,
         'loc_address'              : ' ',
         'location_x'               : 0,
         'location_y'               : 0,
         'communication_state'      : 1,
         'owner'                    : '',
         'alarm_status'             : 3,
         'sw_build_version'         : '5.2.01-0001',
         'ea_server_port'           : 60100,
         'port'                     : 8888,
         'ems_node_id'              : 11640,
         'ems_name'                 : '',
         'supported_rates'          : [1],
         'alarm_status_label'       : 'Minor',
         'ea_server_ip'             : '127.0.0.1',
         'ems_in_sync_state_label'  : 'No',
         'latitude'                 : ' ',
         'user_label'               : 'Chamber Z77',
         'type_group'               : 1,
         'cllicode'                 : ' ',
         'communication_state_label': 'Unavailable',
         'ems_in_sync_state'        : false,
         'ip_address'               : '10.0.2.111',
         'node_sub_type_name'       : '',
         'sw_version'               : '5.2.01',
         'multi_node_group'         : null,
         '__name'                   : 'nw_node',
         'node_sub_type'            : 0,
         'longitude'                : ' ',
         'resolved_ip_address'      : '10.0.2.111',
         'node_system_id'           : -1
         }
         ]

         */

        // ignore empty

        if (!rows || !rows.length) {
            return "";
        }

        // get all the column names using the first object as a canonical template

        var obj:any = JSON.parse(rows);

        var keys = _.keys(obj[0]);

        // write columns names as first row

        var s:string = _.reduce(keys, (memo:string, key:string) => {

            if (memo.length) {
                return memo + "," + key;
            }

            return key;

        }, "");

        // break line

        s += "\r\n";

        // write the values of each key

        _.each(obj, (e:any) => {

            // reduce values in the row to a string

            var t:string = _.reduce(_.values(e), (memo:string, value:any) => {

                var v:string = "";

                if (memo.length) {
                    v += memo + ",";
                }

                // for null, undefined, empty strings, return '-' as value

                var x:any = value;

                if (_.isUndefined(x) || _.isNull(x) || (_.isString(x) && x.length === 0)) {
                    x = '-'
                } else {
                    if (_.isArray(x)) {

                        // reduce arrays to slash seperated values since commas won't work here

                        x = _.reduce(x, function(memo:string, value:any) {

                            return memo + (memo.length ? "/" + value.toString() : value.toString());

                        }, "");
                    }
                }

                return v + x;

            }, "");

            // add to output string and break line

            s += t + "\r\n";
        });

        // return csv

        return s;
    }

}

export = CyGrid;
