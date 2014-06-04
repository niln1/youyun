define(["require",
    "exports",
    '../../../config/base-collection-view',
    '../item/my-class-item-view',
    '../../../models/class-list-collection',
    '../../../message-bus',
    '../../../data-manager'],
    function (require, exports, BaseCollectionView, MyClassItemView, ClassListCollection, MsgBus, DataManager) {
        var MyClassCollectionView = (function (_super) {
            __extends(MyClassCollectionView, _super);

            function MyClassCollectionView(options) {
                _super.call(this, options);
                this.collection = DataManager.I.getClassListCollection();
                this.itemView = MyClassItemView;
                this.listenTo(DataManager.I.getClassListCollection(), "reset", this.render);
            }
            MyClassCollectionView.prototype.onBeforeRender = function () {
                this.collection = DataManager.I.getClassListCollection();
                console.log("Reminder Before Render: " + JSON.stringify(this.collection));
            };
            return MyClassCollectionView;
        })(BaseCollectionView);


        return MyClassCollectionView;
    }
);