define(["require",
    "exports",
    '../../config/base-layout',
    '../header/header-view',
    '../header-background/header-background-view',
    '../main/main-view-layout',
    '../contact/contact-layout',
    "./templates/base-view-layout-tmpl"],
    function (require, exports, BaseLayout, HeaderView, HeaderBackgroundView, MainViewLayout, ContactLayout) {
        var BaseViewLayout = (function (_super) {
            __extends(BaseViewLayout, _super);

            function BaseViewLayout() {
                _super.call(this);
                this.template = require('./templates/base-view-layout-tmpl');
                this.addRegions({
                    headerRegion: '#header-region',
                    headerBackgroundRegion: '#header-background-region',
                    mainRegion: '#main-region',
                    modalRegion: '#modal-region'
                });
            }

            BaseViewLayout.prototype.initSubviews = function () {
                this.showHeaderView();
                this.showHeaderBackgroundView();
                this.showMainViewLayout();
                this.showContactLayout();
            };

            BaseViewLayout.prototype.showHeaderView = function () {
                this.headerRegion.show(new HeaderView());
            };
            BaseViewLayout.prototype.showHeaderBackgroundView = function () {
                var headerBackgroundView = new HeaderBackgroundView();
                this.headerBackgroundRegion.show(headerBackgroundView);
                headerBackgroundView.controller.collapse();
            };
            BaseViewLayout.prototype.showContactLayout = function () {
                var contactLayout = new ContactLayout();
                this.modalRegion.show(contactLayout);
                contactLayout.initSubviews();
            };
            BaseViewLayout.prototype.showMainViewLayout = function () {
                var mainViewLayout = new MainViewLayout();
                this.mainRegion.show(mainViewLayout);
                mainViewLayout.initSubviews();
            };
            return BaseViewLayout;
        })(BaseLayout);


        return BaseViewLayout;
    }
);