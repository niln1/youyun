define(["require", "exports"], function (require, exports) {
    var Router = (function (_super) {
        __extends(Router, _super);

        function Router(controller) {
            _super.call(this, {
                controller: controller,
                appRoutes: {
                    "": "showHomePage",
                    "myclasses": "showClassPage"
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