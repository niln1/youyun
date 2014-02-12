
/// <reference path="vendor/angular/angular.d.ts"/>

import Menu = require('menu');
import Router = require('router');
import ContentRegion = require('content-region');

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

    private menu:Menu;
    private router:Router;
    private contentRegion:ContentRegion;

	constructor() {
        super();

        this.router = new Router(this);

        this.contentRegion = new ContentRegion();

        this.addInitializer(this.routingStarted);
    }

    private routingStarted() {
        if( ! Backbone.History.started ) {
            Backbone.history.start();
        }
	}

    public showLogin() {
        console.log("here, bitch!");
    }

    public showMain() {
        console.log("Main page, biatch!");
    }
 }

$(() => {
	var app = new App();
    app.start();
});

export = App;
