var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../config/base-item-view', '../../models/account-model', '../../data-manager', "./templates/user-profile-view-tmpl"], function(require, exports, BaseItemView, AccountModel, DataManager) {
    var UserProfileView = (function (_super) {
        __extends(UserProfileView, _super);
        function UserProfileView(options) {
            _super.call(this, options);
            this.template = require('./templates/user-profile-view-tmpl');
            this.model = DataManager.I.getAccountModel();
            this.context = this.model.attributes;
        }
        return UserProfileView;
    })(BaseItemView);

    
    return UserProfileView;
});
