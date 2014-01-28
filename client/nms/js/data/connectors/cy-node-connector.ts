/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");

class CyNodeConnector extends CyConnector {

    constructor() {

        super("/api/v1/nodes");
    }
}

export = CyNodeConnector;