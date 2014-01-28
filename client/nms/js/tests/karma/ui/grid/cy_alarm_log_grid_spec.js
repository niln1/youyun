define([
    'util/cy-templates',
    'ui/grid/cy-alarm-log-grid',
    'ui/toolbar/cy-grid-combo-toolbar',
    'ui/component/cy-widget',
    'cy-events' ], function (CyTemplates, CyAlarmLogGrid, CyGridComboToolbar, CyWidget, CyEvents) {

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

    var alarmlog = null;


    var testData = [
        {
            ne_time: 1384546035,
            ne_type: 1008,
            is_system: 0,
            is_ack: 0,
            __name: "config_alarmspolicy",
            annot_count: 0,
            id: 1,
            alarm_entry_id: 1,
            severity: 4,
            add_text: "Connection lost",
            ne_last_set_time: 1380585740,
            me_type: "0",
            is_historic: 0,
            state_add_text: "Alarm status changed by the user",
            prob_cause_qual: 0,
            ems_time: 1384546035,
            state_severity: 4,
            layer_rate: -1,
            state_change: 5,
            service_affecting: 0,
            node_id: 50586,
            me_name: "Unknown:1",
            ne_reported_time: 1380585740,
            user_id: "<unknown>",
            prob_cause: 101,
            ne_last_clear_time: 1380585740,
            active_state: 2,
            node_name: "ISG26S_9_9",
            seq_no: 10667597,
            alarm_category: 0,
            parent_eqpt_type: 0,
            state_id: 10667597
        }];


    // helper method that selects a certain row in a grid
    function selectRow(grid, row) {
        var cell = $('.k-grid-content table tr', grid.element).eq(row).children('td').eq(0);
        cell.simulate('mousedown').simulate('mouseup');
    }

    describe("CyAlarmLogGrid", function () {

        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/alarms/logs",
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
                CyTemplates.loadCss('frames/framed-log-grid/scripts.css', function () {
                    CyTemplates.loadTemplate('frames/framed-log-grid.html', function () {

                        alarmlog = new CyAlarmLogGrid();
                        alarmlog.eventBus = new CyEvents.CyEventManager();
                        alarmlog.element.appendTo($('body'));
                        alarmlog.toolbar = new CyGridComboToolbar('alarmlog-grid', ['viewer']);
                        alarmlog.setGridHeight($(window).height());

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
            CyWidget.disposeTree(alarmlog.element);

            $(document).unbind('DOMNodeInserted');

        });

        it("can return the current selection", function () {

            expect(alarmlog.selections).to.have.length(0);

            selectRow(alarmlog, 0);

            expect(alarmlog.selections).to.have.length(1);

        });

        it("should enable the alarm view button when a selection is made", function () {

            var alarmViewButton = $('button[data-item=viewer]', alarmlog.element);

            should.exist(alarmViewButton.attr('disabled'));

            selectRow(alarmlog, 0);

            should.not.exist(alarmViewButton.attr('disabled'));
        });


        it("should trigger the right event when the alarm view button is pressed", function () {

            var callback = sinon.spy();

            alarmlog.on(CyGridComboToolbar.kVIEWER_CLICKED, callback);

            selectRow(alarmlog, 0);

            $('button[data-item=viewer]', alarmlog.element).click();

            expect(callback.called).to.equal(true);
        });

        it("should resync when reloaded", function (done) {

            var callback = sinon.spy();

            alarmlog.grid.dataSource.bind('change', callback);

            alarmlog.reload();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when refreshed", function (done) {

            var callback = sinon.spy();

            alarmlog.grid.dataSource.bind('change', callback);

            alarmlog.refresh();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when filter is supplied", function (done) {

            var callback = sinon.spy();

            alarmlog.grid.dataSource.bind('change', callback);

            var input = $('input.cyan-autocomplete-input', alarmlog.element);

            input.val("test");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });
    });
});