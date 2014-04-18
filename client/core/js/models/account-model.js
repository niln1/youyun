var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    
    var AccountModel = (function (_super) {
        __extends(AccountModel, _super);
        function AccountModel(attrs, options) {
            _super.call(this, attrs, options);
            this.url = '/api/v1/account';
        }
        AccountModel.prototype.defaults = function () {
            return {
                "username": current_user.username,
                "_id": current_user._id,
                "userImage": current_user.userImage
            };
        };

        AccountModel.prototype.parse = function (response) {
            console.log("Receive AccountModel:" + JSON.stringify(response));
            return response.result;
        };
        return AccountModel;
    })(Backbone.Model);

    
    return AccountModel;
});
