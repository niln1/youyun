var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../config/base-item-view', '../../models/header-model', '../../data-manager', "./templates/header-view-tmpl"], function(require, exports, BaseItemView, HeaderModel, DataManager) {
    var HeaderView = (function (_super) {
        __extends(HeaderView, _super);
        function HeaderView(options) {
            _super.call(this, options);
            this.model = new HeaderModel();
            this.template = require('./templates/header-view-tmpl');
            var accountModel = DataManager.I.getAccountModel();
            var rawData = this.model.data;
            rawData.user = accountModel.attributes;
            this.context = this.model.data;
        }
        return HeaderView;
    })(BaseItemView);

    
    return HeaderView;
});
