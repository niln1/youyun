var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../config/base-layout', './base-view-controller', "./templates/base-view-layout-tmpl"], function(require, exports, BaseLayout, BaseViewController) {
    var BaseViewLayout = (function (_super) {
        __extends(BaseViewLayout, _super);
        function BaseViewLayout() {
            _super.call(this);
            this.template = require('./templates/base-view-layout-tmpl');
            this.addRegions({
                headerRegion: '#header-region',
                headerBackgroundRegion: '#header-background-region',
                mainRegion: '#main-region'
            });
            this.controller = new BaseViewController(this);
        }
        return BaseViewLayout;
    })(BaseLayout);

    
    return BaseViewLayout;
});
