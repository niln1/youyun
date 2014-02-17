
/// <reference path='vendor/backbone/marionette.d.ts'/>

class MessageBus {
    private _events: Backbone.Wreqr.EventAggregator;
    public get events(): Backbone.Wreqr.EventAggregator {
        return this._events;
    }

    private _commands: Backbone.Wreqr.Commands;
    public get commands(): Backbone.Wreqr.Commands {
        return this._commands;
    }

    private _reqres: Backbone.Wreqr.RequestResponse;
    public get reqres(): Backbone.Wreqr.RequestResponse {
        return this._reqres;
    }

    constructor(app : Marionette.Application) {
        this._events = app.vent;
        this._commands = app.commands;
        this._reqres = app.reqres;
    }
}

export = MessageBus;