define([
    'util/cy-templates',
    'util/cy-utils',
    'ui/grid/cy-affected-services-grid',
    'ui/toolbar/cy-affected-services-toolbar',
    'ui/component/cy-widget',
    'cy-events'
    ],
    function (CyTemplates, CyUtils, CyAffectedServicesGrid, CyAffectedServicesToolbar, CyWidget, CyEvents) {

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

        var affectedservices = null;


        var testData = [
            {
                "customer": null,
                "trail_type": 0,
                "last_sync_status": "NA",
                "trail_type_name": "Discovered",
                "name": "OTS:HW31:LINE_FAC-1-6-1<->HW32:LINE_FAC-1-6-1",
                "admin_state_name": "Unlocked",
                "__name": "nw_trail",
                "service_state": 0,
                "service_state_name": "In-Service",
                "last_transition": "TRANSITION_NONE",
                "provision_state": "PROVISIONED",
                "a_end_info": "HW32:LINE_FAC-1-6-1",
                "z_end_info": "HW31:LINE_FAC-1-6-1",
                "admin_state": 1,
                "static_protection_level_name": "Unprotected",
                "owner": "",
                "layer_rate_name": "OTS",
                "static_protection_level": 1,
                "user_label": "",
                "layer_rate": 42
            },
            {
                "customer": null,
                "trail_type": 0,
                "last_sync_status": "NA",
                "trail_type_name": "Discovered",
                "name": "Optical:HW31:LINE_FAC-1-6-1<->HW32:LINE_FAC-1-6-1",
                "admin_state_name": "Unlocked",
                "__name": "nw_trail",
                "service_state": 0,
                "service_state_name": "In-Service",
                "last_transition": "TRANSITION_NONE",
                "provision_state": "PROVISIONED",
                "a_end_info": "HW32:LINE_FAC-1-6-1",
                "z_end_info": "HW31:LINE_FAC-1-6-1",
                "admin_state": 1,
                "static_protection_level_name": "Unprotected",
                "owner": "",
                "layer_rate_name": "Optical",
                "static_protection_level": 1,
                "user_label": "",
                "layer_rate": 47
            }
        ];


        // helper method that selects a certain row in a grid
        function selectRow(grid, row) {
            var cell = $('.k-grid-content table tr', grid.element).eq(row).children('td').eq(0);
            cell.simulate('mousedown').simulate('mouseup');
        }

        describe("CyAffectedServicesGrid", function () {

            beforeEach(function (done) {

                $.mockjaxSettings.logging = false;
                $.mockjaxSettings.responseTime = 0;

                $.mockjax({
                    url: "/api/v1/trails/affected",
                    responseText: JSON.stringify({
                        "count": 2,
                        "index": 0,
                        "last": true,
                        "__name": "page",
                        "objects": testData,
                        total: 2
                    })
                });

                $(document).bind('DOMNodeInserted', function (e) {

                    // let the widget class figure it all out based on the type of the widget

                    CyWidget.DOMNodeInserted($(e.target));
                });

                $.i18n.init(option, function () {
                    CyTemplates.loadCss('main/scripts.css', function () {
                        CyTemplates.loadTemplate('main.html', function () {

                            affectedservices = new CyAffectedServicesGrid('node', 1);
                            affectedservices.eventBus = new CyEvents.CyEventManager();
                            affectedservices.element.appendTo($('body'));
                            affectedservices.toolbar = new CyAffectedServicesToolbar();
                            affectedservices.setGridHeight($(window).height());

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
                CyWidget.disposeTree(affectedservices.element);

                $(document).unbind('DOMNodeInserted');

            });

            it("can return the current selection", function () {

                expect(affectedservices.selections).to.have.length(0);

                selectRow(affectedservices, 0);

                expect(affectedservices.selections).to.have.length(1);

            });

            it("should resync when reloaded", function (done) {

                var callback = sinon.spy();

                affectedservices.grid.dataSource.bind('change', callback);

                affectedservices.reload();

                setTimeout(function () {
                    expect(callback.called).to.equal(true);
                    done();
                }, 100);

            });

            it("should resync when refreshed", function (done) {

                var callback = sinon.spy();

                affectedservices.grid.dataSource.bind('change', callback);

                affectedservices.refresh();

                setTimeout(function () {
                    expect(callback.called).to.equal(true);
                    done();
                }, 100);

            });

            it("should download a csv file when export is clicked", function (done) {

                var exportBtn = $('.cyan-affected-services-export-button', affectedservices.element);

                var location;


                // mocking redirect

                var old = CyUtils.redirect;

                CyUtils.redirect = function (href) {
                    location = href;
                }

                exportBtn.simulate('click');

                setTimeout(function () {
                    expect(location).to.match(/format=csv/);

                    // restore redirect

                    CyUtils.redirect = old;

                    done();
                }, 100);
            });

        });
    }
);