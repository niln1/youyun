define(["require", "exports"], function (require, exports) {

    var AccountModel = (function (_super) {
        __extends(AccountModel, _super);

        function AccountModel(attrs, options) {
            _super.call(this, attrs, options);
            this.url = '/api/v1/account?signature=tempkey';
        }
        AccountModel.prototype.defaults = function () {
            return {
                "username": current_user.username,
                "_id": current_user._id,
                "userImage": current_user.userImage
            };
        };

        AccountModel.prototype.parse = function (response) {
            return response.result;
        };
        return AccountModel;
    })(Backbone.Model);

    return AccountModel;
});