/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");

class CyAffectedServicesConnector extends CyConnector {

    constructor(type, key, format?) {

        this.type = type;
        this.key = key;
        this.format = format;

        super("/api/v1/trails/affected");
    }

    /**
     * Prepares the request before a fetch.  This overridden method adds additional query parameters as required for the
     * web service.
     *
     * queries:
     *
     * &object_type     node | link | trail
     * &object_key      id of the type
     *
     * @param e
     * @returns {string}
     */
    public prepareRequest(e?:any) : string {

        var url = super.prepareRequest(e);

        e.object_type = this.type;

        e.object_key = this.key;

        if (this.format) {
            e.format = this.format;
        }

        return url;
    }

    // type of affected services, i.e node, link, trails

    private _type : string;

    public get type() : string {
        return this._type;
    }

    public set type(value : string) {
        this._type = value;
    }

    // the matching identifier for the type

    private _key : string;

    public get key() : string {
        return this._key;
    }

    public set key(value : string) {
        this._key = value;
    }

    private _format : string;

    public get format() : string {
        return this._format;
    }

    public set format(value : string) {
        this._format = value;
    }
}

export = CyAffectedServicesConnector;