/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");

class CyPortConnector extends CyConnector {

    constructor(node : string) {

        this.node = node;

        super("/api/v1/nodes/" + node + "/ports");
    }

    /**
     * the node name
     * @type string
     */
    private _node : string;

    public get node() : string {
        return this._node;
    }

    public set node(value : string) {
        this._node = value;
    }
}

export = CyPortConnector;