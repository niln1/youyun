define(["require",
    "exports",
    '../../config/base-layout',
    './collection/reminder-collection-view',
    '../../models/reminder-model',
    '../../message-bus',
    '../../data-manager',
    "./templates/reminder-layout-tmpl"],
    function (require, exports, BaseLayout, ReminderCollectionView, ReminderModel, MsgBus, DataManager) {
        var ReminderViewLayout = (function (_super) {
            __extends(ReminderViewLayout, _super);

            function ReminderViewLayout() {
                _super.call(this);
                this.addNewReminderModalId = "#addReminderModal";
                this.newReminderMessage = "#newReminderMessage";
                this.newReminderDate = "#newReminderDatePicker";
                this.newReminderTime = "#newReminderTimePicker";
                this.events = {
                    "click #saveNewReminder": "saveNewReminder"
                };
                this.template = require('./templates/reminder-layout-tmpl');
                this.addRegions({
                    reminderItemsRegion: '#reminder-items-region'
                });
            }
            ReminderViewLayout.prototype.showCollectionView = function () {
                var reminderCollectionView = new ReminderCollectionView({
                    tagName: "ol",
                    id: "reminder-items"
                });
                this.reminderItemsRegion.show(reminderCollectionView);
            };

            ReminderViewLayout.prototype.initDateTimePicker = function () {
                var datePickerOptions = {
                    language: "zh-CN",
                    todayHighlight: true,
                    autoclose: true
                };
                $(this.newReminderDate).datepicker(datePickerOptions);
                $(this.newReminderTime).timepicker();
            };

            ReminderViewLayout.prototype.saveNewReminder = function () {
                console.log("saving new reminder");

                var message = $(this.newReminderMessage).val();
                var date = $(this.newReminderDate).val();
                var time = $(this.newReminderTime).val();

                var dueDate = moment(date + " " + time, "YYYY年MM月DD日 hh:mma");

                console.log(dueDate);

                var newReminder = new ReminderModel({
                    message: message,
                    dueDate: dueDate,
                    signature: "tempkey"
                });
                var onSuccess = function () {
                    DataManager.I.getReminderListCollection().fetch({
                        reset: true
                    });
                };
                newReminder.save({}, {
                    success: onSuccess
                });

                $(this.newReminderMessage).val("");
                $(this.newReminderDate).val("");
                $(this.newReminderTime).val("");

                $(this.addNewReminderModalId).modal('hide');
            };
            return ReminderViewLayout;
        })(BaseLayout);


        return ReminderViewLayout;
    }
);