define([ 'ui/component/cy-widget', 'ui/component/cy-widget-test'], function (CyWidget, CyWidgetTest) {

    describe("CyWidget", function () {

        var widgetChild = new CyWidgetTest();

        it("Widget name matches className", function () {

            expect(widgetChild.getClassName()).to.equal("CyWidgetTest");
        });
    });
});