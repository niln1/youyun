define(["require",
    "exports",
    '../../config/base-item-view',
    "./templates/my-class-view-tmpl"],
    function (require, exports, BaseItemView) {
        var MyClassView = (function (_super) {
            __extends(MyClassView, _super);

            function MyClassView(options) {
                _super.call(this, options);
                this.template = require('./templates/my-class-view-tmpl');
                this.addRegions({
                myClassItemsRegion: '#my-class-items-region'
                });
            }

            MyClassView.prototype.showCollectionView = function () {
                var myClassCollectionView = new MyClassCollectionView({
                    tagName: "div",
                    id: "my-class-items"
                });
                this.myClassItemsRegion.show(MyClassCollectionView);
            };
            return MyClassView;
        })(BaseItemView);

        return MyClassView;
    }
);