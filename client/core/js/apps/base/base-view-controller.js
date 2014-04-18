var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../header/header-view', '../header-background/header-background-view', '../main/main-view-layout'], function(require, exports, HeaderView, HeaderBackgroundView, MainViewLayout) {
    var BaseViewController = (function (_super) {
        __extends(BaseViewController, _super);
        function BaseViewController(View) {
            _super.call(this);
            this._view = View;
        }
        BaseViewController.prototype.showHeaderView = function () {
            this._view.headerRegion.show(new HeaderView());
        };
        BaseViewController.prototype.showHeaderBackgroundView = function () {
            var headerBackgroundView = new HeaderBackgroundView();
            this._view.headerBackgroundRegion.show(headerBackgroundView);
            headerBackgroundView.controller.collapse();
        };
        BaseViewController.prototype.showMainViewLayout = function () {
            var mainViewLayout = new MainViewLayout();
            this._view.mainRegion.show(mainViewLayout);
            mainViewLayout.showFeedCenter();
            mainViewLayout.showLeftPanel();
        };
        return BaseViewController;
    })(Marionette.Controller);

    
    return BaseViewController;
});
