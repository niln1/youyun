define(["require",
    "exports",
    '../../../config/base-collection-view',
    '../item/reminder-item-view',
    '../../../models/reminder-list-collection',
    '../../../message-bus',
    '../../../data-manager'],
    function (require, exports, BaseCollectionView, ReminderItemView, ReminderListCollection, MsgBus, DataManager) {
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
                console.log("Reminder Before Render: " + JSON.stringify(this.collection));
            };
            return ReminderCollectionView;
        })(BaseCollectionView);


        return ReminderCollectionView;
    }
);