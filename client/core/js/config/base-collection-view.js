define(["require", "exports"], function (require, exports) {
    var BaseCollectionView = (function (_super) {
        __extends(BaseCollectionView, _super);

        function BaseCollectionView(options) {
            _super.call(this, options);

            this.events = {};
            this.template = {};
            this.context = {};
        }
        return BaseCollectionView;
    })(Marionette.CollectionView);


    return BaseCollectionView;
});