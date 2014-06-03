define(["require",
    "exports",
    '../../../config/base-collection-view',
    '../item/contact-item-view',
    '../../../models/user-list-collection',
    '../../../message-bus',
    '../../../data-manager'],
    function (require, exports, BaseCollectionView, ContactItemView, UserListCollection, MsgBus, DataManager) {
        var ContactCollectionView = (function (_super) {
            __extends(ContactCollectionView, _super);

            function ContactCollectionView(options) {
                _super.call(this, options);
                this.collection = DataManager.I.getUserListCollection();
                this.itemView = ContactItemView;
                this.listenTo(DataManager.I.getUserListCollection(), "reset", this.render);
            }

            ContactCollectionView.prototype.onBeforeRender = function () {
                // console.log("Contact Before Render: " + JSON.stringify(this.collection));
            };

            return ContactCollectionView;
        })(BaseCollectionView);


        return ContactCollectionView;
    }
);