var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../config/base-collection-view', '../item/reminder-item-view', '../../../models/reminder-list-collection', '../../../message-bus', '../../../data-manager'], function(require, exports, BaseCollectionView, ReminderItemView, ReminderListCollection, MsgBus, DataManager) {
    var ReminderCollectionView = (function (_super) {
        __extends(ReminderCollectionView, _super);
        function ReminderCollectionView(options) {
            _super.call(this, options);
            this.collection = DataManager.I.getReminderListCollection().dueToday().notDone();
            this.itemView = ReminderItemView;
            this.listenTo(DataManager.I.getReminderListCollection(), "reset", this.render);
        }
        ReminderCollectionView.prototype.onBeforeRender = function () {
            this.collection = DataManager.I.getReminderListCollection().dueToday().notDone();
            console.log("Before: " + JSON.stringify(this.collection));
        };
        return ReminderCollectionView;
    })(BaseCollectionView);

    
    return ReminderCollectionView;
});
