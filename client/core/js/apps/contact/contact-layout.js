define(["require",
    "exports",
    '../../config/base-layout',
    '../../message-bus',
    '../../data-manager',
    './collection/contact-collection-view',
    "./templates/contact-layout-tmpl"],
    function (require, exports, BaseLayout, MsgBus, DataManager, ContactCollectionView) {
        var ContactViewLayout = (function (_super) {
            __extends(ContactViewLayout, _super);

            function ContactViewLayout() {
                _super.call(this);
                this.template = require('./templates/contact-layout-tmpl');
                this.addRegions({
                    userItemsRegion: '#contact-modal-items-region'
                });
            }

            ContactViewLayout.prototype.initSubviews = function () {
                this.showCollectionView();
            };

            ContactViewLayout.prototype.showCollectionView = function () {
                var contactCollectionView = new ContactCollectionView({
                    tagName: "ol",
                    id: "contact-items"
                });
                this.userItemsRegion.show(contactCollectionView);
            };

            return ContactViewLayout;
        })(BaseLayout);


        return ContactViewLayout;
    }
);