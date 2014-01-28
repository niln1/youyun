define([
    'data/models/cy-model'
], function (CyModel) {

    var data = {
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
            },
            {
                nv_name: "sites",
                nv_type: "collection_t",
                __name: "sp_namevalue",
                nv_collection: [
                    {
                        nv_name: "_site",
                        nv_value: "foo",
                        nv_type: "string_t",
                        nv_collection: [],
                        __name: "sp_namevalue"
                    },
                    {
                        nv_name: "_site",
                        nv_value: "bar",
                        nv_type: "string_t",
                        nv_collection: [],
                        __name: "sp_namevalue"
                    }
                ]
            },
            {
                nv_name: "components",
                nv_type: "collection_t",
                __name: "sp_namevalue",
                nv_collection: [
                    {
                        nv_name: "component1",
                        nv_value: "foobar",
                        nv_type: "string_t",
                        __name: "sp_namevalue"
                    }
                ]
            }

        ]
    };

    describe("CyModel", function () {

        it("can simplify supplied_parameters type collection", function () {

            var model = new CyModel(data);

            expect(model.simplifyParameters(model.data.supplied_parameters)).to.deep.equal({
                "global_usedtemplate": "MP ELAN",
                "global_oam_profile": "NO_APPLIED_OAM",
                "global_oam_csf": false,
                "global_oam_llf": false,
                "sites": {
                    "_site": [ "foo", "bar" ]
                },
                "components": {
                    "component1": "foobar"
                }
            });
        });
    });
});