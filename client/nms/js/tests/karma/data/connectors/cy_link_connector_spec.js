define([
    'data/connectors/cy-link-connector'
], function (CyLinkConnector) {

    describe("CyLinkConnector", function () {

        it("url is correct", function () {
            var connector = new CyLinkConnector();
            expect(connector.dataSourceUrl).to.equal("/api/v1/links");
        });
    });
});