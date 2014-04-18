var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var HeaderModel = (function (_super) {
        __extends(HeaderModel, _super);
        function HeaderModel() {
            _super.call(this);
            this._data = {
                menuitems: [
                    {
                        class_name: 'home-link',
                        href: '/',
                        name: '个人主页'
                    }, {
                        class_name: 'message-link',
                        href: '/',
                        name: '消息中心'
                    }, {
                        class_name: 'class-link',
                        href: '/',
                        name: '我的班级'
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
