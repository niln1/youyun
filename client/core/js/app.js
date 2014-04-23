var __extends = this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

define(["require",
    "exports",
    './router',
    './apps/base/base-view-layout',
    './message-bus'],
    function (require, exports, Router, BaseViewLayout, MsgBus) {
        var App = (function (_super) {
            __extends(App, _super);

            function App() {
                _super.call(this);
                this.router = new Router(this);
                this.base = new BaseViewLayout();

                this.addRegions({
                    bodyRegion: 'body'
                });

                this.bodyRegion.show(this.base);

                this.addInitializer(this.routingStarted);
            }
            Object.defineProperty(App, "I", {
                get: function () {
                    if (!App.instance)
                        App.instance = new App();
                    return App.instance;
                },
                set: function (I) {
                    App.instance = I;
                },
                enumerable: true,
                configurable: true
            });


            App.prototype.routingStarted = function () {
                if (!Backbone.History.started) {
                    Backbone.history.start();
                }
            };

            App.prototype.showHomePage = function () {
                this.base.initSubviews();
            };
            return App;
        })(Marionette.Application);

        $(function () {
            var app = App.I;
            app.start();
        });


        return App;
    }
);