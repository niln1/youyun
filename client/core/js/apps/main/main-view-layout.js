define(["require", "exports", '../../config/base-layout', '../feed-center/feed-center-view', '../left-panel/left-panel-view-layout', "./templates/main-view-layout-tmpl"], function (require, exports, BaseLayout, FeedCenterView, LeftPanelViewLayout) {
    var MainViewLayout = (function (_super) {
        __extends(MainViewLayout, _super);

        function MainViewLayout() {
            _super.call(this);
            this.template = require('./templates/main-view-layout-tmpl');
            this.addRegions({
                leftPanelRegion: '#left-panel-region',
                rightPanelRegion: '#right-panel-region'
            });
        }
        MainViewLayout.prototype.showFeedCenter = function () {
            var feedCenterView = new FeedCenterView();
            this.rightPanelRegion.show(feedCenterView);
            feedCenterView.updateTime();
        };

        MainViewLayout.prototype.showLeftPanel = function () {
            var leftPanelLayout = new LeftPanelViewLayout();
            this.leftPanelRegion.show(leftPanelLayout);
            leftPanelLayout.showUserProfile();
            leftPanelLayout.showReminder();
        };
        return MainViewLayout;
    })(BaseLayout);


    return MainViewLayout;
});