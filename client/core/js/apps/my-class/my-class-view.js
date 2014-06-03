define(["require",
    "exports",
    '../../config/base-item-view',
    "./templates/my-class-view-tmpl"],
    function (require, exports, BaseItemView) {
        var MyClassView = (function (_super) {
            __extends(MyClassView, _super);

            function MyClassView(options) {
                _super.call(this, options);
                this.template = require('./templates/my-class-view-tmpl');
            }
            return MyClassView;
        })(BaseItemView);

        return MyClassView;
    }
);