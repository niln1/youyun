var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../config/base-layout', '../user-profile/user-profile-view', '../reminder/reminder-view-layout', "./templates/left-panel-view-layout-tmpl"], function(require, exports, BaseLayout, UserProfileView, ReminderViewLayout) {
    var LeftPanelViewLayout = (function (_super) {
        __extends(LeftPanelViewLayout, _super);
        function LeftPanelViewLayout() {
            _super.call(this);
            this.template = require('./templates/left-panel-view-layout-tmpl');
            this.addRegions({
                leftTopRegion: '#left-top-region',
                leftBottomRegion: '#left-bottom-region'
            });
        }
        LeftPanelViewLayout.prototype.showUserProfile = function () {
            this.leftTopRegion.show(new UserProfileView());
        };

        LeftPanelViewLayout.prototype.showReminder = function () {
            var reminderViewLayout = new ReminderViewLayout();
            this.leftBottomRegion.show(reminderViewLayout);
            reminderViewLayout.initDateTimePicker();
            reminderViewLayout.showCollectionView();
        };
        return LeftPanelViewLayout;
    })(BaseLayout);

    
    return LeftPanelViewLayout;
});
