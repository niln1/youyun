define(["require", "exports"], function (require, exports) {
    var ClassModel = (function (_super) {
        __extends(ClassModel, _super);

        function ClassModel(attrs, options) {
            _super.call(this, attrs, options);
            this.urlRoot = 'api/v1/classes';
            this.idAttribute = "_id";
        }
        ClassModel.prototype.defaults = function () {
            return {};
        };
        return ClassModel;
    })(Backbone.Model);

    return ClassModel;
});