define(["require",
    "exports",
    '../../config/base-layout',
    "./collection/my-class-collection-view",
    "./templates/my-class-view-tmpl"],
    function (require, exports, BaseLayout, MyClassCollectionView) {
        var MyClassLayout = (function (_super) {
            __extends(MyClassLayout, _super);

            function MyClassLayout(options) {
                _super.call(this, options);
                this.template = require('./templates/my-class-view-tmpl');
                this.addRegions({
                    myClassItemsRegion: '#my-class-items-region'
                });
            }

            MyClassLayout.prototype.showCollectionView = function () {
                var myClassCollectionView = new MyClassCollectionView({
                    tagName: "ol",
                    id: "my-class-items"
                });
                this.myClassItemsRegion.show(MyClassCollectionView);
            };
            return MyClassLayout;
        })(BaseLayout);

        return MyClassLayout;
    }
);