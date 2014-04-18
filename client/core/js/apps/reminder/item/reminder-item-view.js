var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../config/base-item-view', '../../../models/reminder-model', '../../../data-manager', "./templates/reminder-item-view-tmpl"], function(require, exports, BaseItemView, ReminderModel, DataManager) {
    var ReminderItemView = (function (_super) {
        __extends(ReminderItemView, _super);
        function ReminderItemView(options) {
            _super.call(this, options);
            this.momentConfigFormat = 'lll';
            this.momentConfigLang = 'zh-cn';
            this.events = {
                "click .toggle-reminder": "afterToggle",
                "click .remove-reminder": "afterRemove"
            };
            this.template = require('./templates/reminder-item-view-tmpl');
            this.model.id = this.model.get('_id');
            this.context.message = this.model.get('message');
            this.context.dueDate = this.getTimeString();
        }
        ReminderItemView.prototype.getTimeString = function () {
            moment.lang(this.momentConfigLang);
            var timeString = this.model.get('dueDate');
            return timeString ? moment(timeString).calendar() : "";
        };

        ReminderItemView.prototype.afterToggle = function () {
            console.log("after Toggle");
            this.model.toggle();
        };

        ReminderItemView.prototype.afterRemove = function () {
            console.log("after Remove");
            var onSuccess = function () {
                console.log("destroy successful");
                DataManager.I.getReminderListCollection().fetch({ reset: true });
            };
            this.model.clear(onSuccess);
        };
        return ReminderItemView;
    })(BaseItemView);

    
    return ReminderItemView;
});
