define([
    'data/connectors/cy-affected-services-connector'
], function (CyAffectedServicesConnector) {

    describe("CyAffectedServicesConnector", function () {

        it("should generate a url that has the required type and key", function () {

            var connector = new CyAffectedServicesConnector('node', 1);

            var params = {};

            var url = connector.prepareRequest(params);

            expect(url).to.equal("/api/v1/trails/affected");
            expect(params.object_type).to.equal("node");
            expect(params.object_key).to.equal(1);

        });

        it("should generate a url that has the format if supplied", function () {

            var connector = new CyAffectedServicesConnector('node', 1, "foo");

            var params = {};

            var url = connector.prepareRequest(params);

            expect(url).to.equal("/api/v1/trails/affected");
            expect(params.format).to.equal("foo");

        });
    });
});