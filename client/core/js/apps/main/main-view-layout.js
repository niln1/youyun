define(["require",
    "exports",
    '../../config/base-layout',
    '../feed-center/feed-center-view',
    '../my-class/my-class-layout',
    '../left-panel/left-panel-view-layout',
    "./templates/main-view-layout-tmpl"],
    function (require, exports, BaseLayout, FeedCenterView, MyClassLayout, LeftPanelViewLayout) {
        var MainViewLayout = (function (_super) {
            __extends(MainViewLayout, _super);

            function MainViewLayout(view) {
                _super.call(this);
                this.template = require('./templates/main-view-layout-tmpl');
                this.addRegions({
                    leftPanelRegion: '#left-panel-region',
                    rightPanelRegion: '#right-panel-region'
                });
            }

            MainViewLayout.prototype.initSubviews = function (rightView) {
                this.showLeftPanel();
                this.showRightPanel(rightView);
            };

            MainViewLayout.prototype.showRightPanel = function (view) {
                if (view === "feed") {
                    var feedCenterView = new FeedCenterView();
                    this.rightPanelRegion.show(feedCenterView);
                    feedCenterView.updateTime();
                } else if (view === "my-class") {
                    var myClassLayout = new MyClassLayout();
                    this.rightPanelRegion.show(myClassLayout);
                    myClassLayout.showCollectionView();
                }
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
    }
);