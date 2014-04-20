define(["require", "exports"], function (require, exports) {
    var BaseLayout = (function (_super) {
        __extends(BaseLayout, _super);

        function BaseLayout() {
            _super.call(this);
            this.events = {};
            this.template = {};
            this.context = {};
        }
        BaseLayout.prototype.render = function () {
            this.setElement(this.template(this.context));
            return this.el;
        };
        return BaseLayout;
    })(Marionette.Layout);


    return BaseLayout;
});