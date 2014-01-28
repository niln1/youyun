/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyUtils = require("../../util/cy-utils");
import CyEvents = require("../../cy-events");
import CyMessage = require("../../cy-message");
import CyModel = require("../models/cy-model");

/**
 * CyConnector provides a base class or all other data source connectors.  This class basically wraps a kendo.dataSource.
 * Instead of littering our classes that need to interact with the server with multiple dataSource definitions, all logic
 * that deals with the acquiring or writing of data should be consolidate to classes of this type.
 * @class CyConnector
 */
class CyConnector {

    /**
     * constructs a new connector
     * @param dataSourceUrl     the url for the web service
     * @constructor
     */
    constructor(dataSourceUrl : string, dataSourceConfig?:kendo.data.DataSourceOptions) {

        this._dataSourceUrl = dataSourceUrl;
        this._customOptions = dataSourceConfig;
    }

    /**
     * number of results to return per page which defaults to 25
     */
    private _pageSize : number = 25;

    public get pageSize() : number {
        return this._pageSize;
    }

    public set pageSize(value : number) {
        this._pageSize = value;

        this.dataSource.pageSize(value);
    }

    /**
     * global text filter
     */
    private _filter : string;

    public get filter() : string {
        return this._filter;
    }

    public set filter(value : string) {
        this._filter = value;
    }

    /**
     * web service url
     * @type string
     * @private
     */
    private _dataSourceUrl : string;

    /**
     * property getter for dataSourceUrl
     * @returns {string}
     * @public
     */
    public get dataSourceUrl() : string {
        return this._dataSourceUrl;
    }

    /**
     * property setter for dataSourceUrl
     * @param value
     * @public
     */
    public set dataSourceUrl(value : string) {
        this._dataSourceUrl = value;
    }

    /**
     * kendo data source instance
     * @type kendo.data.DataSource
     * @private
     */
    private _dataSource : kendo.data.DataSource;

    /**
     * lazily creates a data source
     * @returns {kendo.data.DataSource}
     */
    public get dataSource() : kendo.data.DataSource {

        if (!this._dataSource) {
            this._dataSource = new kendo.data.DataSource(_.extend(this.dataSourceConfig, this.customOptions));
        }

        return this._dataSource;
    }

    public get dataSourceConfig() : kendo.data.DataSourceOptions {
        return {
            transport: {
                read: {
                    dataType: 'json',
                    url: $.proxy(this.prepareRequest, this)
                }
            },
            schema: {
                data: function (response:any):any {
                    return response.objects;
                },
                total: function (response:any):any {
                    return response.total;
                }
            },
            pageSize: this.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            change: $.proxy(this.onDataSourceChange, this)
        };
    }

    /**
     * optional override for kendo data source
     */
    private _customOptions : kendo.data.DataSourceOptions;

    public get customOptions() : kendo.data.DataSourceOptions {
        return this._customOptions;
    }

    public set customOptions(value : kendo.data.DataSourceOptions) {
        this._customOptions = value;
    }

    /**
     * Triggers a new event when data is fetched
     * @param e
     */
    public onDataSourceChange(e:any) {

        this.trigger(CyMessage.kCONNECTOR_DATA_CHANGED, {
            sender: this,
            data: this.dataSource.data()
        });
    }

    /**
     * prepares the url before fetching
     * @returns {string}
     */
    public prepareRequest(e:any) : string {

        // simplify and convert kendo pagination parameters [take/page/pageSize/skip] into the index/count

        CyUtils.createPaginationQueryFromKendoQuery(e);

        // turn kendo sort parameters into cyan sort parameters

        CyUtils.createSortQueryFromKendoQuery(e);

        // apply filter if exist

        if (this.filter) {
            e.filter = this.filter;
        }

        return this.dataSourceUrl;
    }

    /**
     * builds the request url and returns the full parameterized string
     */
    public buildRequest() : string {

        var e = {}; // e is used to specify the query parameters

        var url = this.prepareRequest(e);

        // if extra parameters were added, build the url encoded string for it

        if (Object.keys(e).length > 1) {
            url += "?";
            var params = [];
            _.each(e, (val, key?:any) => {
                if (val) {
                    params.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                }
            });

            url += params.join('&');
        }

        return url;
    }

    /**
     * fetches from the web service
     */
    public read() : void {

        this.dataSource.read();

    }

    /**
     * Returns the data.
     */
    public data() : any {
        return this.dataSource.data().toJSON();
    }

    /**
     * writes data to the web service
     * @param data
     */
    public write(model : CyModel) {

        $.ajax({
            url: this.getPostUrl(model),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: this.getPostParameters(model)
        });
    }

    /**
     * Provides the url to post.  This is meant to be overridden if the url isn't the same as the dataSourceUrl
     * @param model
     * @returns {string}
     */
    public getPostUrl(model : CyModel) {

        return this.dataSourceUrl;
    }

    /**
     * Provides the data to post.  This is meant to be overridden if this data needs to be different than how the model
     * is internally represented.
     * @param model
     * @returns {string}
     */
    public getPostParameters(model : CyModel) : string {

        return JSON.stringify(model.data);
    }

    /**
     * internal event bus. You can switch this for some other event bus to make the connector propagate events
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
     * To make it easier to sink events / trigger events with CyConnector that expose a copy of the CyEventManager
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
}

export = CyConnector;