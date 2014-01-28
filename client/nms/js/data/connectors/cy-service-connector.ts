/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");

class CyServiceConnector extends CyConnector {

    constructor() {

        super("/api/v1/services");
    }
}

export = CyServiceConnector;