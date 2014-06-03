define(["require",
    "exports",
    '../../config/base-layout',
    '../feed-center/feed-center-view',
    '../left-panel/left-panel-view-layout',
    "./templates/main-view-layout-tmpl"],
    function (require, exports, BaseLayout, FeedCenterView, LeftPanelViewLayout) {
        var MainViewLayout = (function (_super) {
            __extends(MainViewLayout, _super);

            function MainViewLayout(view) {
                _super.call(this);
                this._view = view;
                this.template = require('./templates/main-view-layout-tmpl');
                this.addRegions({
                    leftPanelRegion: '#left-panel-region',
                    rightPanelRegion: '#right-panel-region'
                });
            }

            MainViewLayout.prototype.initSubviews = function () {
                this.showLeftPanel();
                this.showRightPanel(this._view);
            };

            MainViewLayout.prototype.showRightPanel = function (view) {
                if (view === "feed") {
                    var feedCenterView = new FeedCenterView();
                    this.rightPanelRegion.show(feedCenterView);
                    feedCenterView.updateTime();
                } else if (view === "classes") {
                    var myClassView = new MyClassView();
                    this.rightPanelRegion.show(myClassView);
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
    });