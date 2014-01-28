define([
    'data/connectors/cy-alarm-log-connector'
], function (CyAlarmLogConnector) {

    describe ("CyAlarmLogConnector", function () {

        it("url is correct", function () {

            var connector = new CyAlarmLogConnector();

            expect(connector.dataSourceUrl).to.equal("/api/v1/alarms/logs");
        });
    });
});