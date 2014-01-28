define([
    'ui/component/cy-range-picker',
    'ui/component/cy-widget',
    'util/cy-templates'
], function (CyRangePicker, CyWidget, CyTemplates) {

    var container;
    var rangepicker;

    describe("CyRangePicker", function (done) {

        beforeEach(function (done) {
            CyTemplates.loadTemplate('main.html', function () {
                container = $('<div></div>').appendTo($('body'));
                rangepicker = new CyRangePicker();
                rangepicker.element.appendTo(container);
                done();
            });
        });

        afterEach(function (done) {
            CyWidget.disposeTree(rangepicker.element);
            container.remove();
            done();
        });

        it("should trigger an event when start value changes", function (done) {

            var callback = sinon.spy();

            rangepicker.on(CyRangePicker.kSTART_PICKER_CHANGED, callback);

            var input = $('input[data-element=start]', rangepicker.element);

            input.val("11/15/2013 12:00 AM");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {
                expect(callback.called).to.equal(true);
                done();
            }, 100);
        });

        it("should trigger an event when end value changes", function (done) {

            var callback = sinon.spy();

            rangepicker.on(CyRangePicker.kEND_PICKER_CHANGED, callback);

            var input = $('input[data-element=end]', rangepicker.element);

            input.val("11/15/2012 12:00 AM");
            input.simulate('keydown', { keyCode: $.simulate.keyCode.ENTER }).simulate('keyup', { keyCode: $.simulate.keyCode.ENTER });

            setTimeout(function () {

                expect(callback.called).to.equal(true);
                expect(rangepicker.startDate.getTime()).to.be.at.most(rangepicker.endDate.getTime());

                done();
            }, 100);
        });

    });
});