var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
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
