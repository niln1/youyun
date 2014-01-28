define([
    'data/connectors/cy-connector',
    'data/models/cy-model',
    'cy-message'
], function (CyConnector, CyModel, CyMessage) {

    var connector;

    describe("CyConnector", function () {

        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/test",
                responseText: JSON.stringify({
                    "count": 1,
                    "index": 0,
                    "last": true,
                    "objects": [{
                        "test": "data"
                    }],
                    total: 1
                })
            });

            connector = new CyConnector("/api/v1/test");

            done();
        });

        afterEach(function (done) {

            connector = null;

            // clean up ajax settings

            $.mockjaxClear();

            done();

        });

        it("should issue request using the right url provided in the constructor", function (done) {

            connector.read();

            // connector.read is an asynchronous call so wait a little before checking for validity

            setTimeout(function () {

                var request = CyTestUtil.getLastRequest();

                // make sure url in the request matches the data source url
                expect(request.url).to.equal(connector.dataSourceUrl);

                done();
            }, 100);

        });

        it("should post to the same url unless overridden", function (done) {

            connector.write(new CyModel());

            // connector.write is an asynchronous call

            setTimeout(function () {

                var request = CyTestUtil.getLastRequest();

                // data source is equal
                expect(request.url).to.equal(connector.dataSourceUrl);

                // request type is POST
                expect(request.type).to.equal('POST');

                done();
            }, 100);

        });

        it("should take custom kendo data source options", function (done) {

            // setup default sort which is a kendo data source option
            connector.customOptions = {
                sort: {
                    field: "custom_field",
                    dir: "dsc"
                }
            };

            connector.read();

            // connector.read is async
            setTimeout(function () {

                var request = CyTestUtil.getLastRequest();

                // sort by custom field dsc
                expect(request.data.sort_by).to.equal('-custom_field');
                done();
            }, 100);

        });

        it("can set a page size", function (done) {

            // set page size
            connector.pageSize = 30;

            connector.read();

            // connector.read is async

            setTimeout(function () {

                var request = CyTestUtil.getLastRequest();

                // count is the request page size
                expect(request.data.count).to.equal(30);

                done();
            }, 100);

        });

        it("can set a filter", function (done) {

            // set global filter to test
            connector.filter = "test";

            connector.read();

            // connector.read is async
            setTimeout(function () {

                var request = CyTestUtil.getLastRequest();

                // filter equals test
                expect(request.data.filter).to.equal("test");

                done();
            }, 100);

        });

        it("should trigger an event when data is fetched", function (done) {

            // create callback spy
            var callback = sinon.spy();

            // listen to change event
            connector.on(CyMessage.kCONNECTOR_DATA_CHANGED, callback);
            // trigger event with a fetch
            connector.read();

            setTimeout(function () {

                // callback should be called
                expect(callback.called).to.equal(true);
                done();

            }, 100);

        });

        it("should retrieve data from response.objects", function (done) {

            // listen to change event
            connector.on(CyMessage.kCONNECTOR_DATA_CHANGED, function () {

                // expecting response.objects
                expect(connector.data()).to.deep.equal([{
                    "test": "data"
                }]);

                done();
            });

            connector.read();
        });
    });
});