/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyConnector = require("./cy-connector");

/**
 * Connector for the user account model
 */
class CyUserConnector extends CyConnector {

    constructor() {

        // getuser call returns non-standard response
        super("/api/v1/accounts/getuser", {
            schema: {
                parse: function (response:any) {
                    return [ response.message ];
                }
            },
            serverPaging: false
        });
    }
}

export = CyUserConnector;