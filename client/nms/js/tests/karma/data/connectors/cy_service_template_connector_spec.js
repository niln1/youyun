define([
    'data/connectors/cy-service-template-connector'
], function (CyServiceTemplateConnector) {

    describe("CyServiceTemplateConnector", function () {

        it("url is correct", function () {
            var connector = new CyServiceTemplateConnector();
            expect(connector.dataSourceUrl).to.equal("/api/v1/serviceTemplates");
        });
    });
});