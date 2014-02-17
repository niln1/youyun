
/// <reference path='vendor/backbone/marionette.d.ts'/>

import MessageBus = require('message-bus');

class App extends Marionette.Application {
	/**
	 * singleton instance for the app class. Access via the I() public/static method
	 *
	 * @method I
	 * @return {App} A singleton instance of the application.
	 */
	public static instance:App;

	public static get I():App {
		if (!App.instance) App.instance = new App();
		return App.instance;
	}

	public static set I(I:App) {
		App.instance = I;
	}

    private _messageBus : MessageBus;
    public get messageBus() : MessageBus {
        return this._messageBus;
    }
//    private headerRegion:Marionette.Region;
//    private headerBackgroundRegion:Marionette.Region;
//    private mainRegion:Marionette.Region;

	constructor() {
        super();

        // Initialize messageBus
        this._messageBus = new MessageBus(this);

//        this.addRegions({
//            headerRegion: "#header-region",
//            headerBackgroundRegion: "#header-background-region",
//            mainRegion: '#main-region'
//        })

//        this.reqres.setHandler('default:region', this.mainRegion);

        this.addInitializer(this.initializeModules);

        this.on('initialize:after', this.startBackboneHistory);
    }

    private initializeModules() {
//        this.module("header-app").start();
        this._messageBus.commands.execute('user:route');
	}

    private startBackboneHistory() {
        if (Backbone.History.started) {
            Backbone.history.start();
        }
    }
}

$(() => {
	var app = new App();
    app.start();
});

export = App;
