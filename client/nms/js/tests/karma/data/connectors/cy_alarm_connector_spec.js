define([
    'data/connectors/cy-alarm-connector',
    'data/models/cy-alarm-model'
], function (CyAlarmConnector, CyAlarmModel) {

    var connector;

    describe("CyAlarmConnector", function () {

        beforeEach(function () {

            connector = new CyAlarmConnector();

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/alarms",
                type: "POST"
            });
        });

        afterEach(function () {

            connector = null;
            $.mockjaxClear();

        });

        it("request url is correct", function () {

            expect(connector.dataSourceUrl).to.equal("/api/v1/alarms");
        });

        it("post parameters are correct when acknowledging an alarm", function (done) {

            connector.write(new CyAlarmModel({ id: 0, is_ack: 1}));

            setTimeout(function () {

                var request = CyTestUtil.getLastRequest();

                expect(request.url).to.equal("/api/v1/alarms");
                expect(request.type).to.equal("POST");

                expect(JSON.parse(request.data).alarm_id).to.equal(0);
                expect(JSON.parse(request.data).method).to.equal("ack");

                done();

            }, 100);

        });
    });
});