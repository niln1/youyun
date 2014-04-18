define(["require", "exports", '../../config/base-item-view', './header-background-view-controller', "./templates/header-background-view-tmpl"], function (require, exports, BaseItemView, HeaderBackgroundViewController) {
    var HeaderBackgroundView = (function (_super) {
        __extends(HeaderBackgroundView, _super);

        function HeaderBackgroundView(options) {
            _super.call(this, options);
            this.template = require('./templates/header-background-view-tmpl');
            this.controller = new HeaderBackgroundViewController(this);
        }
        return HeaderBackgroundView;
    })(BaseItemView);

    return HeaderBackgroundView;
});