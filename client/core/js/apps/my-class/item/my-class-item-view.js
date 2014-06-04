define(["require",
    "exports",
    '../../../config/base-item-view',
    '../../../models/class-model',
    '../../../data-manager',
    "./templates/my-class-item-view-tmpl"],
    function (require, exports, BaseItemView, ClassModel, DataManager) {
        var MyClassItemView = (function (_super) {
            __extends(MyClassItemView, _super);

            function MyClassItemView(options) {
                _super.call(this, options);
                this.template = require('./templates/my-class-item-view-tmpl');
                this.model.id = this.model.get('_id');
            }
            return MyClassItemView;
        })(BaseItemView);

        return MyClassItemView;
    }
);