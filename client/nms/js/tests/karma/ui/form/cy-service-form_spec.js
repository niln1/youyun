define([
    'util/cy-templates',
    'ui/component/cy-widget',
    'ui/form/cy-service-form'
], function (CyTemplates, CyWidget, CyServiceForm) {

    describe("CyServiceForm", function () {
        var testServiceForm = new CyServiceForm();

        /*
        beforeEach(function (done) {

        });

        afterEach(function (done) {

        });
        */

        it("Can build its element", function() {
            /*
            buildElement calls most of the other methods including:
              initializeSources
              registerBindings
              getServiceDetail
            But setting some service data will exercise more code.
             */
            expect(function() {
                testServiceForm.buildElement()
            }).not.to.throw();
        });
    });
});
