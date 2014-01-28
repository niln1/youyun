define([
    'data/models/cy-service-model'
], function (CyServiceModel) {

    var data = {
        last_transition: "TRANSITION_NONE",
        op_state_qual: "NR",
        description: "Discovered Network Service",
        supplied_parameters: [
            {
                nv_name: "global_usedtemplate",
                nv_value: "MP ELAN",
                nv_type: "string_t",
                nv_collection: [ ],
                __name: "sp_namevalue"
            },
            {
                nv_name: "global_oam_profile",
                nv_value: "NO_APPLIED_OAM",
                nv_type: "string_t",
                nv_collection: [ ],
                __name: "sp_namevalue"
            },
            {
                nv_name: "global_oam_csf",
                nv_value: "False",
                nv_type: "bool_t",
                nv_collection: [ ],
                __name: "sp_namevalue"
            },
            {
                nv_name: "global_oam_llf",
                nv_value: "False",
                nv_type: "bool_t",
                nv_collection: [ ],
                __name: "sp_namevalue"
            }
        ],
        synchronization_status: "SYNC_SUCCEEDED",
        __name: "ns_networkservice",
        circuit_id: "MP ELAN 4444",
        used_template: "MP ELAN",
        trail_type: "DISCOVERED",
        provision_state: "PROVISIONED",
        admin_state: "AdminAutoInService",
        owner: "",
        service_id: 1762,
        customer_id: "",
        user_label: "MP ELAN 4444",
        service_state: "IN_SERVICE"
    };

    describe("CyServiceModel", function () {
        it("can retrieve/parse global service parameters", function () {

            var model = new CyServiceModel(data);

            expect(model.getGlobalParameters()).to.deep.equal({
                "circuit_id": "MP ELAN 4444",
                "used_template": "MP ELAN",
                "description": "Discovered Network Service",
                "trail_type": "DISCOVERED",
                "provision_state": "PROVISIONED",
                "sync_status": "SYNC_SUCCEEDED",
                "supplied_parameters": {
                    "global_usedtemplate": "MP ELAN",
                    "global_oam_profile": "NO_APPLIED_OAM",
                    "global_oam_csf": false,
                    "global_oam_llf": false
                }
            });
        });
    });
});