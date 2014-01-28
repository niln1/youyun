define([
    'util/cy-templates',
    'ui/grid/cy-link-grid',
    'ui/toolbar/cy-grid-combo-toolbar',
    'ui/component/cy-widget',
    'cy-events'
], function (CyTemplates, CyLinkGrid, CyGridComboToolbar,  CyWidget, CyEvents) {

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

    var linkgrid = null;


    var testData = [
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


    // helper method that selects a certain row in a grid
    function selectRow(grid, row) {
        var cell = $('.k-grid-content table tr', grid.element).eq(row).children('td').eq(0);
        cell.simulate('mousedown').simulate('mouseup');
    }

    describe("CyLinkGrid", function () {

        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/links",
                responseText: JSON.stringify({
                    "count": 1,
                    "index": 0,
                    "last": false,
                    "__name": "page",
                    "objects": testData
                })
            });

            $(document).bind('DOMNodeInserted', function (e) {

                // let the widget class figure it all out based on the type of the widget

                CyWidget.DOMNodeInserted($(e.target));
            });

            $.i18n.init(option, function () {
                CyTemplates.loadCss('frames/framed-link-grid/scripts.css', function () {
                    CyTemplates.loadTemplate('frames/framed-link-grid.html', function () {

                        linkgrid = new CyLinkGrid();
                        linkgrid.eventBus = new CyEvents.CyEventManager();
                        linkgrid.element.appendTo($('body'));
                        linkgrid.toolbar = new CyGridComboToolbar('link-grid', ['show-affected-services']);
                        linkgrid.setGridHeight($(window).height());

                        // allow enough time for data to be gathered
                        // since this is mocked ajax, it shouldn't take long
                        setTimeout(function () {
                            done();
                        }, 100);
                    });
                });
            });


        });

        afterEach(function () {
            // clean up ajax settings
            $.mockjaxClear();

            // clear any dynamically added stylesheets
            $('head link[rel="stylesheet"]').remove();

            // clean up widget
            CyWidget.disposeTree(linkgrid.element);

            $(document).unbind('DOMNodeInserted');

        });

        it("can return the current selection", function () {

            expect(linkgrid.selections).to.have.length(0);

            selectRow(linkgrid, 0);

            expect(linkgrid.selections).to.have.length(1);

        });

        it("should enable the services button when a selection is made", function () {

            var servicesButton = $('button[data-item=show-affected-services]', linkgrid.element);

            should.exist(servicesButton.attr('disabled'));

            selectRow(linkgrid, 0);

            should.not.exist(servicesButton.attr('disabled'));
        });


        it("should trigger the right event when the services button is pressed", function () {

            var callback = sinon.spy();

            linkgrid.on(CyGridComboToolbar.kAFFECTED_TRAILS_CLICKED, callback);

            selectRow(linkgrid, 0);

            $('button[data-item=show-affected-services]', linkgrid.element).click();

            expect(callback.called).to.equal(true);

        });

        it("should resync when reloaded", function (done) {

            var callback = sinon.spy();

            linkgrid.grid.dataSource.bind('change', callback);

            linkgrid.reload();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when refreshed", function (done) {

            var callback = sinon.spy();

            linkgrid.grid.dataSource.bind('change', callback);

            linkgrid.refresh();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when filter is supplied", function (done) {

            var callback = sinon.spy();

            linkgrid.grid.dataSource.bind('change', callback);

            var input = $('input.cyan-autocomplete-input', linkgrid.element);

            input.val("test");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });
    });
});