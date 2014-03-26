/// <reference path='vendor/backbone/marionette.d.ts'/>

class MessageBus{
    /**
     * singleton instance for the msgBus class. Access via the I() public/static method
     *
     * @method I
     * @return msgBus A singleton instance of the message bus.
     */
    public static instance:MessageBus;

    public static get I():MessageBus {
        if (!MessageBus.instance) MessageBus.instance = new MessageBus();
        return MessageBus.instance;
    }

    public static set I(I:MessageBus) {
        MessageBus.instance = I;
    }

    public reqres : Backbone.Wreqr.RequestResponse;
    public command: Backbone.Wreqr.Commands;
    public events : Backbone.Wreqr.EventAggregator;

    constructor(){
        this.reqres = new Backbone.Wreqr.RequestResponse();
        this.command = new Backbone.Wreqr.Commands();
        this.events = new Backbone.Wreqr.EventAggregator();
    }
}
export = MessageBus;
