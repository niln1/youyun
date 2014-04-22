define(["require",
    "exports",
    './user-model'],
    function (require, exports, UserModel) {
        var UserListCollection = (function (_super) {
            __extends(UserListCollection, _super);

            function UserListCollection(models, options) {
                this.url = '/api/v1/users?signature=tempkey';
                _super.call(this, models, {
                    model: UserModel
                });
            }
            UserListCollection.prototype.parse = function (response) {
                console.log(response);
                return response.result;
            };

            return UserListCollection;
        })(Backbone.Collection);

        return UserListCollection;
    }
);