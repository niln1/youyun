
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

import Router = require('./router');
import BaseViewLayout = require('./apps/base/base-view-layout');

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

    private router:Router;
    private base:BaseViewLayout;

    //to remove the ws complain
    private bodyRegion:any;

	constructor() {
        super();

        this.router = new Router(this);
        this.base = new BaseViewLayout();

        this.addRegions({
            bodyRegion : 'body'
        });

        this.bodyRegion.show(this.base);

        this.addInitializer(this.routingStarted);
    }

    private routingStarted() {
        if( ! Backbone.History.started ) {
            Backbone.history.start();
        }
	}

    public showMain() {
        this.base.controller.showHeaderView();
        this.base.controller.showHeaderBackgroundView();
        this.base.controller.showMainViewLayout();

    }
}

$(() => {
	var app = App.I;
    app.start();
});

export = App;
