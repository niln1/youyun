define(["require", "exports", "./class-model"],
    function (require, exports, ClassModel) {
        var ClassListCollection = (function (_super) {
            __extends(ClassListCollection, _super);

            function ClassListCollection(models, options) {
                this.url = '/api/v1/classes?signature=tempkey';
                _super.call(this, models, {
                    model: ClassModel
                });
            }
            ClassListCollection.prototype.parse = function (response) {
                console.log(response);
                return response.result;
            };

        })(Backbone.Collection);

        return ClassListCollection;
    });