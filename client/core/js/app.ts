
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

import HeaderView = require('views/header-view');
import HeaderBackgroundView = require('views/header-background-view');
import Router = require('router');
import ContentRegion = require('regions/content-region');
import HeaderRegion = require('regions/header-region');
import HeaderBackgroundRegion = require('regions/header-background-region');

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
    private contentRegion:ContentRegion;
    private headerRegion:HeaderRegion;
    private headerBackgroundRegion:HeaderBackgroundRegion;

	constructor() {
        super();

        this.router = new Router(this);

        this.contentRegion = new ContentRegion();
        this.headerRegion = new HeaderRegion();
        this.headerBackgroundRegion = new HeaderBackgroundRegion();

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
        var headerContext = {
            menuitems: [{
                class: 'home-link',
                href: '/',
                name: '个人主页'
            }, {
                class: 'message-link',
                href: '/',
                name: '消息中心'
            }, {
                class: 'class-link',
                href: '/',
                name: '我的班级'
            }]
        };
        var headerView = new HeaderView(headerContext);
        var headerBackgroundView = new HeaderBackgroundView();
        this.headerRegion.show(headerView);
        this.headerBackgroundRegion.show(headerBackgroundView);
    }
 }

$(() => {
	var app = new App();
    app.start();
});

export = App;
