define([
    'data/connectors/cy-port-connector'
], function (CyPortConnector) {

    describe("CyPortConnector", function () {

        it("url is correct", function () {

            var connector = new CyPortConnector("nodeA");

            expect(connector.dataSourceUrl).to.equal("/api/v1/nodes/nodeA/ports");
        });
    });
});