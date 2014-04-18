var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var ReminderModel = (function (_super) {
        __extends(ReminderModel, _super);
        function ReminderModel(attrs, options) {
            _super.call(this, attrs, options);
            this.urlRoot = 'api/v1/reminders';
            this.idAttribute = "_id";
        }
        ReminderModel.prototype.defaults = function () {
            return {
                message: '',
                dueDate: new Date(),
                isDone: false
            };
        };

        ReminderModel.prototype.toggle = function () {
            this.save({ isDone: !this.get('isDone'), signature: "tempkey" }, { patch: true });
        };

        ReminderModel.prototype.clear = function (onSuccess) {
            this.url = this.urlRoot + "/" + this.attributes[this.idAttribute] + "?signature=tempkey";
            this.destroy({
                success: onSuccess
            });
        };
        return ReminderModel;
    })(Backbone.Model);

    
    return ReminderModel;
});
