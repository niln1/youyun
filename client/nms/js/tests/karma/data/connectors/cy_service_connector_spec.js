define([
    'data/connectors/cy-service-connector'
], function (CyServiceConnector) {

    describe("CyServiceConnector", function () {

        it("url is correct", function () {
            var connector = new CyServiceConnector();
            expect(connector.dataSourceUrl).to.equal("/api/v1/services");
        });
    });
});