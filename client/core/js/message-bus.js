define(["require", "exports"], function (require, exports) {
    var MessageBus = (function () {
        function MessageBus() {
            this.reqres = new Backbone.Wreqr.RequestResponse();
            this.command = new Backbone.Wreqr.Commands();
            this.events = new Backbone.Wreqr.EventAggregator();
        }
        Object.defineProperty(MessageBus, "I", {
            get: function () {
                if (!MessageBus.instance)
                    MessageBus.instance = new MessageBus();
                return MessageBus.instance;
            },
            set: function (I) {
                MessageBus.instance = I;
            },
            enumerable: true,
            configurable: true
        });

        return MessageBus;
    })();

    return MessageBus;
});