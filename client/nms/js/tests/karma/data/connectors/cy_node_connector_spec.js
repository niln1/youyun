define([
    'data/connectors/cy-node-connector'
], function (CyNodeConnector) {

    describe("CyNodeConnector", function () {

        it("url is correct", function () {
            var connector = new CyNodeConnector();
            expect(connector.dataSourceUrl).to.equal("/api/v1/nodes");
        });
    });
});