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

            BaseViewLayout.prototype.initSubviews = function (view) {
                this.showHeaderView(view);
                this.showHeaderBackgroundView();
                this.showMainViewLayout(view);
                this.showContactLayout();
            };

            BaseViewLayout.prototype.showHeaderView = function (view) {
                this.headerRegion.show(new HeaderView(view));
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

            BaseViewLayout.prototype.showMainViewLayout = function (view) {
                var mainViewLayout = new MainViewLayout();
                this.mainRegion.show(mainViewLayout);
                mainViewLayout.initSubviews(view);
            };

            return BaseViewLayout;
        })(BaseLayout);


        return BaseViewLayout;
    }
);