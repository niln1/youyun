define(["require", "exports"], function (require, exports) {
    var UserModel = (function (_super) {
        __extends(UserModel, _super);

        function UserModel(attrs, options) {
            _super.call(this, attrs, options);
            this.urlRoot = 'api/v1/users';
            this.idAttribute = "_id";
        }
        UserModel.prototype.defaults = function () {
            return {};
        };
        return UserModel;
    })(Backbone.Model);

    return UserModel;
});