define([ 'ui/component/cy-inputbox', 'ui/component/cy-widget', 'util/cy-templates'], function (CyInputBox, CyWidget, CyTemplates) {

    var container;
    var inputbox;

    describe("CyInputBox", function () {

        beforeEach(function (done) {
            CyTemplates.loadTemplate('main.html', function () {
                container = $('<div></div>').appendTo($('body'));
                inputbox = new CyInputBox();
                inputbox.element.appendTo(container);
                done();
            });
        });

        afterEach(function (done) {
            container.empty();
            container.remove();
            done();
        });

        it("should trigger event when cleared", function (done) {
            var callback = sinon.spy();

            inputbox.on(CyInputBox.kCHANGED, callback);

            $('a', inputbox.element).click();

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);

        });

        it("should trigger event when value is changed", function (done) {

            var callback = sinon.spy();

            inputbox.on(CyInputBox.kCHANGED, callback);

            var input = $('input', inputbox.element);

            input.val("testing");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });
    });
});