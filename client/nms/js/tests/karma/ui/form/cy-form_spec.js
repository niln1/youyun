define([
    'ui/form/cy-form',
    'data/connectors/cy-connector'
], function (
    CyForm,
    CyConnector
){
    describe("CyForm", function() {

        var testForm = new CyForm("TestForm");
        var testConnector = new CyConnector('fake');
        testForm.connector = testConnector;

        it("Widget name matches className since it is a widget", function() {
            expect(testForm.getClassName()).to.equal("TestForm");
        });

        it("Default validation is true", function() {
            expect(testForm.validate(null)).to.equal(true);
        });

        it("Should store connector properly", function() {
            expect(testForm.connector).to.equal(testConnector);
        });

    });
})
