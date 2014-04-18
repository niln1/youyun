var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './reminder-model'], function(require, exports, ReminderModel) {
    var ReminderListCollection = (function (_super) {
        __extends(ReminderListCollection, _super);
        function ReminderListCollection(models, options) {
            this.url = '/api/v1/reminders?signature=tempkey';
            _super.call(this, models, { model: ReminderModel });
        }
        ReminderListCollection.prototype.parse = function (response) {
            console.log(response);
            return response.result;
        };

        ReminderListCollection.prototype.comparator = function (model) {
            return model.get('dueDate');
        };

        ReminderListCollection.prototype.dueToday = function () {
            var filteredReminderItems = this.filter(function (reminder) {
                var dueDate = reminder.get("dueDate");
                return moment(dueDate).diff(moment(), 'days') === 0;
            });
            return new ReminderListCollection(filteredReminderItems);
        };

        ReminderListCollection.prototype.notDone = function () {
            var filteredReminderItems = this.filter(function (reminder) {
                var isDone = reminder.get("isDone");
                return !isDone;
            });
            return new ReminderListCollection(filteredReminderItems);
        };
        return ReminderListCollection;
    })(Backbone.Collection);

    
    return ReminderListCollection;
});
