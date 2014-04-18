var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
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
