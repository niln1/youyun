define(["require", "exports"], function (require, exports) {
    var HeaderModel = (function (_super) {
        __extends(HeaderModel, _super);

        function HeaderModel() {
            _super.call(this);
            this._data = {
                menuitems: [
                    {
                        class_name: 'home-link',
                        href: '#',
                        name: '个人主页'
                    }, {
                        class_name: 'class-link',
                        href: '#myclasses',
                        name: '我的班级'
                    }, {
                        class_name: 'manage-link',
                        href: '/usermanage',
                        name: '管理'
                    }],
                school: {
                    school_name: '平和学校',
                    school_logo: '/core/img/school-logo-pinghe-login-white.png'
                }
            };
        }
        Object.defineProperty(HeaderModel.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        return HeaderModel;
    })(Backbone.Model);


    return HeaderModel;
});