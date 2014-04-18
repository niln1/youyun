var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Router = (function (_super) {
        __extends(Router, _super);
        function Router(controller) {
            _super.call(this, {
                controller: controller,
                appRoutes: {
                    "": "showMain"
                }
            });
            this.controller = controller;
            Router.instance = this;
        }
        Object.defineProperty(Router, "I", {
            get: function () {
                if (!Router.instance)
                    return null;
                return Router.instance;
            },
            enumerable: true,
            configurable: true
        });
        return Router;
    })(Marionette.AppRouter);

    
    return Router;
});
