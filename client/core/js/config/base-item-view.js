define(["require", "exports"], function (require, exports) {
    var BaseItemView = (function (_super) {
        __extends(BaseItemView, _super);

        function BaseItemView(options) {
            _super.call(this, options);

            this.events = {};
            this.template = {};
            this.context = {};
        }
        BaseItemView.prototype.render = function () {
            this.setElement(this.template(this.context));
            return this.el;
        };
        return BaseItemView;
    })(Marionette.ItemView);


    return BaseItemView;
});