define([
    'ui/window/cy-node-selector',
    'util/cy-templates',
    'ui/component/cy-widget',
    'ui/window/cy-window',
    'ui/window/cy-dialog'
], function (CyNodeSelector, CyTemplates, CyWidget, CyWindow, CyDialog) {

    describe("CyNodeSelector", function () {

        var nodeSelector;

        // i18n options

        var option = {
            resGetPath: '/nms/i18n/__lng__/__ns__.json',
            ns: {
                namespaces: [ 'translation', 'cyms' ],
                defaultNs: 'translation'
            },
            fallbackLng: 'en',
            cookieName: 'cy.i18n',
            keyseparator: '|'
        };

        var testNodes = [
            {
                "ne_type": 3,
                "weight": 0.0,
                "loc_address": " ",
                "location_x": 0.0,
                "location_y": 0.0,
                "communication_state": 0,
                "owner": "",
                "alarm_status": 3,
                "sw_build_version": "5.0.01-0042",
                "ea_server_port": 60100,
                "port": 8888,
                "ems_node_id": 1021,
                "ems_name": "",
                "supported_rates": [1, 47, 49, 40, 42, 41, 10002, 339, 334, 325, 10004, 108, 105, 98, 113, 23],
                "alarm_status_label": "Minor",
                "ea_server_ip": "127.0.0.1",
                "ems_in_sync_state_label": "Yes",
                "latitude": " ",
                "user_label": "HW32",
                "type_group": 1,
                "cllicode": " ",
                "communication_state_label": "CS_AVAILABLE",
                "ems_in_sync_state": true,
                "ip_address": "HW32",
                "node_sub_type_name": "",
                "sw_version": "5.0.01",
                "multi_node_group": null,
                "__name": "nw_node",
                "node_sub_type": 0,
                "longitude": " ",
                "resolved_ip_address": "10.0.7.190",
                "node_system_id": 573604360
            }
        ];


        beforeEach(function (done) {
        
            $('<div class="master-page-body" />').appendTo($("body"));

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/nodes",
                responseText: JSON.stringify({
                    "count": 1,
                    "index": 0,
                    "last": false,
                    "__name": "page",
                    "objects": testNodes
                })
            });


            $(document).bind('DOMNodeInserted', function (e) {

                // let the widget class figure it all out based on the type of the widget

                CyWidget.DOMNodeInserted($(e.target));
            });

            $.i18n.init(option, function () {
                CyTemplates.loadTemplate('main.html', function () {
                    nodeSelector = new CyNodeSelector();

                    // node selector makes an asynchronous call when attaching the grid content
                    setTimeout(function () {
                        done();
                    }, 100);
                });
            });

        });

        afterEach(function () {
            $(".master-page-body").remove()
            $.mockjaxClear();

        });

        it("should have the necessary columns for the grid and in the correct order", function () {

            var headers = $('[role=columnheader]', nodeSelector.element);

            var col1 = headers.eq(0);
            var col2 = headers.eq(1);
            var col3 = headers.eq(2);
            var col4 = headers.eq(3);

            expect(col1.attr('data-title'), "Name is present").to.equal('Name');
            expect(col1.is(':visible'), "Name is visible").to.equal(true);
            expect(col2.attr('data-title'), "DCN IP (resolved) is present").to.equal('DCN IP (resolved)');
            expect(col2.is(':visible'), "DCN IP (resolved) is visible").to.equal(true);
            expect(col3.attr('data-title'), "Software Version is present").to.equal('Software Version');
            expect(col3.is(':visible'), "Software Version is visible").to.equal(true);
            expect(col4.attr('data-title'), "Comm State is present").to.equal('Comm State');
            expect(col4.is(':visible'), "Comm State is visible").to.equal(true);
        });

        it("closes when a row is double clicked and modal result is OK", function (done) {

            nodeSelector.on(CyWindow.kEVENT_CLOSING, function () {

                // dialog was closed successfully
                expect(nodeSelector.modalResult == CyDialog.kMODAL_OK);

                // and a valid selection was made
                expect(nodeSelector.selections.length).to.equal(1);
                done();
            });

            CyTestUtil.dblClickKendoGridRow(nodeSelector.nodegrid, 0);

        });
    });
});