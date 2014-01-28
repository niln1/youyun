define([
    'data/connectors/cy-trail-connector'
], function (CyTrailConnector) {

    describe("CyTrailConnector", function () {

        it("url is correct", function () {
            var connector = new CyTrailConnector();
            expect(connector.dataSourceUrl).to.equal("/api/v1/trails");
        });
    });
});