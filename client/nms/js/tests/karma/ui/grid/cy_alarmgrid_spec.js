define([
    'util/cy-templates',
    'ui/grid/cy-alarm-grid',
    'ui/toolbar/cy-grid-combo-toolbar',
    'ui/component/cy-widget',
    'cy-events',
    'cy-socket-manager'
    ], function (CyTemplates, CyAlarmGrid, CyGridComboToolbar, CyWidget, CyEvents, CySocketManager) {

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

    var alarmgrid = null;


    var testData = [
        {
            ne_time: 0,
            ne_type: 0,
            is_system: 0,
            state_change_label: "",
            is_ack: 0,
            __name: "config_alarmspolicy",
            annot_count: 0,
            prob_cause_label: "Communication Fail",
            severity_label: "Critical",
            id: 1,
            alarm_entry_id: 0,
            severity: 6,
            add_text: "Connection lost",
            ne_last_set_time: 1389310157,
            start_date: 0,
            me_type: "7",
            is_historic: 0,
            state_add_text: "",
            prob_cause_qual: 0,
            ems_time: 0,
            state_severity: 0,
            layer_rate: 0,
            prob_cause_qual_label: "N/A",
            state_change: 0,
            service_affecting: 0,
            end_date: 0,
            node_id: 42804,
            me_name: "OID_CLASS_NODE:ROOT",
            ne_reported_time: 1389310157,
            user_id: 0,
            me_type_label: "CYAN_Z77",
            prob_cause: 101,
            is_ack_label: "No",
            ne_last_clear_time: 1389310157,
            active_state: 1,
            node_name: "crecuero sim",
            seq_no: 0,
            alarm_category: 0,
            parent_eqpt_type: 0,
            state_id: 0
        },
        {
            ne_time: 0,
            ne_type: 0,
            is_system: 0,
            state_change_label: "",
            is_ack: 0,
            __name: "config_alarmspolicy",
            annot_count: 0,
            prob_cause_label: "Communication Fail",
            severity_label: "Major",
            id: 3,
            alarm_entry_id: 0,
            severity: 5,
            add_text: "Connection failed",
            ne_last_set_time: 1387866103,
            start_date: 0,
            me_type: "18",
            is_historic: 0,
            state_add_text: "",
            prob_cause_qual: 0,
            ems_time: 0,
            state_severity: 0,
            layer_rate: 0,
            prob_cause_qual_label: "N/A",
            state_change: 0,
            service_affecting: 0,
            end_date: 0,
            node_id: 61405,
            me_name: "OID_CLASS_NODE:ROOT",
            ne_reported_time: 1387866103,
            user_id: 0,
            me_type_label: "CYAN_Z33",
            prob_cause: 101,
            is_ack_label: "No",
            ne_last_clear_time: 1387866103,
            active_state: 1,
            node_name: "smadadi-sim",
            seq_no: 0,
            alarm_category: 0,
            parent_eqpt_type: 0,
            state_id: 0
        },
        {
            ne_time: 0,
            ne_type: 0,
            is_system: 0,
            state_change_label: "",
            is_ack: 0,
            __name: "config_alarmspolicy",
            annot_count: 0,
            prob_cause_label: "Communication Fail",
            severity_label: "Minor",
            id: 4,
            alarm_entry_id: 0,
            severity: 4,
            add_text: "Connection lost",
            ne_last_set_time: 1389209329,
            start_date: 0,
            me_type: "36",
            is_historic: 0,
            state_add_text: "",
            prob_cause_qual: 0,
            ems_time: 0,
            state_severity: 0,
            layer_rate: 0,
            prob_cause_qual_label: "N/A",
            state_change: 0,
            service_affecting: 0,
            end_date: 0,
            node_id: 58531,
            me_name: "OID_CLASS_NODE:ROOT",
            ne_reported_time: 1389209329,
            user_id: 0,
            me_type_label: "CYAN_Z22",
            prob_cause: 101,
            is_ack_label: "No",
            ne_last_clear_time: 1389209329,
            active_state: 1,
            node_name: "Addis Ababa",
            seq_no: 0,
            alarm_category: 0,
            parent_eqpt_type: 0,
            state_id: 0
        },
        {
            ne_time: 0,
            ne_type: 0,
            is_system: 0,
            state_change_label: "",
            is_ack: 0,
            __name: "config_alarmspolicy",
            annot_count: 0,
            prob_cause_label: "Communication Fail",
            severity_label: "Warning",
            id: 4,
            alarm_entry_id: 0,
            severity: 3,
            add_text: "Connection lost",
            ne_last_set_time: 1389209329,
            start_date: 0,
            me_type: "36",
            is_historic: 0,
            state_add_text: "",
            prob_cause_qual: 0,
            ems_time: 0,
            state_severity: 0,
            layer_rate: 0,
            prob_cause_qual_label: "N/A",
            state_change: 0,
            service_affecting: 0,
            end_date: 0,
            node_id: 58531,
            me_name: "OID_CLASS_NODE:ROOT",
            ne_reported_time: 1389209329,
            user_id: 0,
            me_type_label: "CYAN_Z22",
            prob_cause: 101,
            is_ack_label: "No",
            ne_last_clear_time: 1389209329,
            active_state: 1,
            node_name: "Addis Ababa",
            seq_no: 0,
            alarm_category: 0,
            parent_eqpt_type: 0,
            state_id: 0
        }
    ];


    // helper method that selects a certain row in a grid
    function selectRow(grid, row) {
        var cell = $('.k-grid-content table tr', grid.element).eq(row).children('td').eq(0);
        cell.simulate('mousedown').simulate('mouseup');
    }

    describe("CyAlarmGrid", function () {

        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/alarms",
                type: 'GET',
                responseText: JSON.stringify({
                    "count": 1,
                    "index": 0,
                    "last": false,
                    "__name": "page",
                    "objects": testData
                })
            });

            $.mockjax({
                url: "/api/v1/alarms",
                type: 'POST'
            });

            $(document).bind('DOMNodeInserted', function (e) {

                // let the widget class figure it all out based on the type of the widget

                CyWidget.DOMNodeInserted($(e.target));
            });

            $.i18n.init(option, function () {
                CyTemplates.loadCss('frames/framed-alarm-grid/scripts.css', function () {
                    CyTemplates.loadTemplate('frames/framed-alarm-grid.html', function () {

                        alarmgrid = new CyAlarmGrid();
                        alarmgrid.eventBus = new CyEvents.CyEventManager();
                        alarmgrid.element.appendTo($('body'));
                        alarmgrid.toolbar = new CyGridComboToolbar('alarm-grid', ['acknowledge', 'viewer']);
                        alarmgrid.setGridHeight($(window).height());

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
            CyWidget.disposeTree(alarmgrid.element);

            $(document).unbind('DOMNodeInserted');

        });

        it("can return the current selection", function () {

            expect(alarmgrid.selections).to.have.length(0);

            selectRow(alarmgrid, 0);

            expect(alarmgrid.selections).to.have.length(1);

        });

        it("should enable the alarm view button when a selection is made", function () {

            var alarmViewButton = $('button.cyan-alarmgrid-viewer-button', alarmgrid.element);

            should.exist(alarmViewButton.attr('disabled'));

            selectRow(alarmgrid, 0);

            should.not.exist(alarmViewButton.attr('disabled'));
        });

        it("should trigger the right event when the alarm view button is pressed", function () {

            var callback = sinon.spy();

            alarmgrid.on(CyGridComboToolbar.kVIEWER_CLICKED, callback);

            selectRow(alarmgrid, 0);

            $('button[data-item=viewer]', alarmgrid.element).click();

            expect(callback.called).to.equal(true);
        });


        it("should resync when reloaded", function (done) {

            var callback = sinon.spy();

            alarmgrid.grid.dataSource.bind('change', callback);

            alarmgrid.reload();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should resync when refreshed", function (done) {

            var callback = sinon.spy();

            alarmgrid.grid.dataSource.bind('change', callback);

            alarmgrid.refresh();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("can acknowledge an unacknowledged alarm", function () {

            var mockedAjaxCalls = $.mockjax.mockedAjaxCalls;

            var existing = mockedAjaxCalls().length;

            selectRow(alarmgrid, 0);

            $('button[data-item=acknowledge]', alarmgrid.element).click();

            assert(mockedAjaxCalls().length > existing);

            var request = mockedAjaxCalls()[mockedAjaxCalls().length - 1];

            expect(request.url).to.equal("/api/v1/alarms");

            expect(request.type).to.equal("POST");

            should.exist(JSON.parse(request.data).alarm_id);

            should.exist(JSON.parse(request.data).method);
        });

        it("should resync when filter is supplied", function (done) {

            var callback = sinon.spy();

            alarmgrid.grid.dataSource.bind('change', callback);

            var input = $('input.cyan-autocomplete-input', alarmgrid.element);

            input.val("test");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });

        it("should resync when socket manager triggers a change event", function (done) {

            var callback = sinon.spy();

            alarmgrid.grid.dataSource.bind('change', callback);

            alarmgrid.trigger(CySocketManager.kALARMS_CHANGED);

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });

        it("should add class to the rows depending on their severities", function () {

            var rows = $('.k-grid-content table tr', alarmgrid.element);

            expect(rows.eq(0).hasClass('alarm-severity-critical')).to.equal(true);
            expect(rows.eq(1).hasClass('alarm-severity-major')).to.equal(true);
            expect(rows.eq(2).hasClass('alarm-severity-minor')).to.equal(true);
            expect(rows.eq(3).hasClass('alarm-severity-warning')).to.equal(true);
        });

        it("should sort by severity desc by default (critical to warning)", function () {

            // retrieve request object from intercepted call

            var request = CyTestUtil.getLastRequest();

            expect(request.data.sort_by).to.equal("-severity");

        });

        it("should use the correct fields for enumerated types", function () {

            // inspect the table columns for the correct fields

            // sourceType
            var sourceHeader = $("[data-title='Source Type']", alarmgrid.element);
            expect(sourceHeader.attr('data-field')).to.equal('me_type_label');

            // probableCause
            var probCauseHeader = $("[data-title='Prob. Cause']", alarmgrid.element);
            expect(probCauseHeader.attr('data-field')).to.equal('prob_cause_label');

            var probCauseQualHeader = $("[data-title='Prob. Cause Qlty.']", alarmgrid.element);
            expect(probCauseQualHeader.attr('data-field')).to.equal('prob_cause_qual_label');

            // isAcknowledged
            var isAckHeader = $("[data-title='Acknowledged']", alarmgrid.element);
            expect(isAckHeader.attr('data-field')).to.equal('is_ack_label');

        });
    });
});