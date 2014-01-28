define([
    'util/cy-templates',
    'ui/grid/cy-grid',
    'ui/grid/cy-analytics-grid',
    'ui/toolbar/cy-analytics-toolbar',
    'ui/component/cy-widget',
    'cy-events'
    ],
    function (CyTemplates, CyGrid, CyAnalyticsGrid, CyAnalyticsToolbar, CyWidget, CyEvents) {

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

    var analyticsgrid = null;
    var container;

    var testData = [
        {
            __v: 0,
            _id: "528e55ede4b8b70000000001",
            category: "web operate",
            date_created: "2013-11-21T18:50:21.454Z",
            event: "alarm grid viewer opened",
            opt_extra: "",
            opt_number: -1,
            opt_string: "",
            session_id: "32wbJXppNfNxzf0AHK6IGDoZ",
            user_id: -1
        }
    ];


    // helper method that selects a certain row in a grid
    function selectRow(grid, row) {
        var cell = $('.k-grid-content table tr', grid.element).eq(row).children('td').eq(0);
        cell.simulate('mousedown').simulate('mouseup');
    }

    describe("CyAnalyticsGrid", function () {

        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/analytics/read",
                responseText: JSON.stringify({
                    "count": 1,
                    "description": "Read events successfully",
                    "message": "Read events successfully",
                    "result": true,
                    "source": "Planet Operate Web Server",
                    "objects": testData
                })
            });

            $(document).bind('DOMNodeInserted', function (e) {

                // let the widget class figure it all out based on the type of the widget

                CyWidget.DOMNodeInserted($(e.target));
            });

            $.i18n.init(option, function () {
                CyTemplates.loadCss('analytics/scripts.css', function () {
                    CyTemplates.loadTemplate('analytics.html', function () {

                        container = $('<div></div>').appendTo($('body'));
                        analyticsgrid = new CyAnalyticsGrid();
                        analyticsgrid.eventBus = new CyEvents.CyEventManager();
                        analyticsgrid.element.appendTo(container);
                        analyticsgrid.toolbar = new CyAnalyticsToolbar();
                        analyticsgrid.setGridHeight($(window).height());

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
            CyWidget.disposeTree(analyticsgrid.element);

            container.remove();

            analyticsgrid = null;

            $(document).unbind('DOMNodeInserted');

        });

        it("can return the current selection", function () {

            expect(analyticsgrid.selections).to.have.length(0);

            selectRow(analyticsgrid, 0);

            expect(analyticsgrid.selections).to.have.length(1);

        });

        it("should resync when reloaded", function (done) {

            var callback = sinon.spy();

            analyticsgrid.grid.dataSource.bind('change', callback);

            analyticsgrid.reload();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when refreshed", function (done) {

            var callback = sinon.spy();

            analyticsgrid.grid.dataSource.bind('change', callback);

            analyticsgrid.refresh();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when filter is supplied", function (done) {

            var callback = sinon.spy();

            analyticsgrid.grid.dataSource.bind('change', callback);

            var input = $('input.cyan-autocomplete-input', analyticsgrid.element);

            input.val("test");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });

        it("should resync when a start date is supplied", function (done) {

            var callback = sinon.spy();

            analyticsgrid.grid.dataSource.bind('change', callback);

            var input = $("input[data-element=start]", analyticsgrid.element);
            input.val("11/15/2013 12:00 AM");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 200);

        });

        it("should resync when an end date is supplied", function (done) {
            var callback = sinon.spy();

            analyticsgrid.grid.dataSource.bind('change', callback);

            var input = $("input[data-element=end]", analyticsgrid.element);
            input.val("11/15/2013 12:00 AM");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 200);
        });
    });
});