define([
    'data/connectors/cy-analytics-connector'
], function (CyAnalyticsConnector) {

    var connector = new CyAnalyticsConnector();

    describe("CyAnalyticsConnector", function () {

        beforeEach(function () {

            connector = new CyAnalyticsConnector();

        });

        afterEach(function () {

            connector = null;
        });

        it("get request url is correct", function () {

            expect(connector.dataSourceUrl).to.equal("/api/v1/analytics/read");

        });

        it("date range is supplied by default on get", function () {

            var params = {};

            var url = connector.prepareRequest(params);

            expect(params.start).to.equal(connector.startDate.getTime());

            expect(params.end).to.equal(connector.endDate.getTime());

        });

        it("post request url is correct", function () {

            expect(connector.getPostUrl()).to.equal("/api/v1/analytics/create");
        });

    });
});