/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyModel = require("./cy-model");

class CyServiceModel extends CyModel {

    /**
     * get parameters global to all service types
     */
    public getGlobalParameters() : any {

        var params = {};

        params["circuit_id"] = this.data.circuit_id;
        params["used_template"] = this.data.used_template;
        params["description"] = this.data.description;
        params["trail_type"] = this.data.trail_type;
        params["provision_state"] = this.data.provision_state;
        params["sync_status"] = this.data.synchronization_status;
        params["supplied_parameters"] = this.simplifyParameters(this.data.supplied_parameters);

        return params;
    }

}

export = CyServiceModel;

