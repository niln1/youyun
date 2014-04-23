define(["require",
    "exports",
    '../../../config/base-item-view',
    '../../../models/user-model',
    '../../../data-manager',
    "./templates/contact-item-view-tmpl"],
    function (require, exports, BaseItemView, UserModel, DataManager) {
        var ContactItemView = (function (_super) {
            __extends(ContactItemView, _super);

            function ContactItemView(options) {
                _super.call(this, options);
                this.template = require('./templates/contact-item-view-tmpl');
                this.model.id = this.model.get('_id');
                this.context.username = this.model.get('username');
                this.context.userImage = this.model.get('userImage');
            }
            return ContactItemView;
        })(BaseItemView);


        return ContactItemView;
    }
);