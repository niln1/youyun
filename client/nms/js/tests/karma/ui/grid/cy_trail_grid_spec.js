define([
    'util/cy-templates',
    'ui/grid/cy-trail-grid',
    'ui/toolbar/cy-grid-combo-toolbar',
    'ui/component/cy-widget',
    'cy-events'
], function (CyTemplates, CyTrailGrid, CyGridComboToolbar, CyWidget, CyEvents) {

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

    var trailgrid = null;


    var testData = [
        {
            customer: "",
            trail_type: 0,
            last_sync_status: "NA",
            trail_type_name: "Discovered",
            name: "Optical:proton:FAC-1-1-1-1<->proton:FAC-1-3-1-1",
            admin_state_name: "Auto In-Service",
            __name: "nw_trail",
            service_state: 1,
            service_state_name: "Out-of-Service",
            last_transition: "TRANSITION_NONE",
            provision_state: "PROVISIONED",
            a_end_info: "proton:FAC-1-1-1-1",
            z_end_info: "proton:FAC-1-3-1-1",
            admin_state: 2,
            static_protection_level_name: "Unprotected",
            owner: "",
            layer_rate_name: "Optical",
            static_protection_level: 1,
            user_label: "",
            layer_rate: 47
        }];


    // helper method that selects a certain row in a grid
    function selectRow(grid, row) {
        var cell = $('.k-grid-content table tr', grid.element).eq(row).children('td').eq(0);
        cell.simulate('mousedown').simulate('mouseup');
    }

    describe("CyTrailGrid", function () {

        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/trails",
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
                CyTemplates.loadCss('frames/framed-trail-grid/scripts.css', function () {
                    CyTemplates.loadTemplate('frames/framed-trail-grid.html', function () {

                        trailgrid = new CyTrailGrid();
                        trailgrid.eventBus = new CyEvents.CyEventManager();
                        trailgrid.element.appendTo($('body'));
                        trailgrid.toolbar = new CyGridComboToolbar('trail-grid', ['show-affected-services']);
                        trailgrid.setGridHeight($(window).height());

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
            CyWidget.disposeTree(trailgrid.element);

            $(document).unbind('DOMNodeInserted');

        });

        it("can return the current selection", function () {

            expect(trailgrid.selections).to.have.length(0);

            selectRow(trailgrid, 0);

            expect(trailgrid.selections).to.have.length(1);

        });

        it("should enable the services button when a selection is made", function () {

            var servicesButton = $('button[data-item=show-affected-services]', trailgrid.element);

            should.exist(servicesButton.attr('disabled'));

            selectRow(trailgrid, 0);

            should.not.exist(servicesButton.attr('disabled'));
        });

        it("should trigger the right event when the services button is pressed", function () {

            var callback = sinon.spy();

            trailgrid.on(CyGridComboToolbar.kAFFECTED_TRAILS_CLICKED, callback);

            selectRow(trailgrid, 0);

            $('button[data-item=show-affected-services]', trailgrid.element).click();

            expect(callback.called).to.equal(true);

        });

        it("should resync when reloaded", function (done) {

            var callback = sinon.spy();

            trailgrid.grid.dataSource.bind('change', callback);

            trailgrid.reload();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when refreshed", function (done) {

            var callback = sinon.spy();

            trailgrid.grid.dataSource.bind('change', callback);

            trailgrid.refresh();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when filter is supplied", function (done) {

            var callback = sinon.spy();

            trailgrid.grid.dataSource.bind('change', callback);

            var input = $('input.cyan-autocomplete-input', trailgrid.element);

            input.val("test");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });
    });
});