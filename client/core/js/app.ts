
/// <reference path="vendor/angular/angular.d.ts"/>

import MainController = require('main-controller');
import LoginController = require('login-controller');
import Authentication = require('authentication');
import Menu = require('menu');
import Router = require('router');

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

	constructor() {
        super();

        this.router = new Router(this);

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
