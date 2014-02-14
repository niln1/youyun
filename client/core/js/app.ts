
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

import Router = require('./router');

import HeaderView = require('./views/header-view');
import HeaderBackgroundView = require('./views/header-background-view');
import FeedCenterView = require('./views/feed-center-view');
import LoginView = require('./views/login-view');
import UserProfileView = require('./views/user-profile-view');
import ReminderView = require('./views/reminder-view');

import SplitViewLayout = require('./views/split-view-layout');

import ContentRegion = require('./regions/content-region');
import HeaderRegion = require('./regions/header-region');
import HeaderBackgroundRegion = require('./regions/header-background-region');
import LeftPanelRegion = require('./regions/left-panel-region');
import RightPanelRegion = require('./regions/right-panel-region');



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
    private leftPanelRegion:LeftPanelRegion;
    private rightPanelRegion:RightPanelRegion;

	constructor() {
        super();

        this.router = new Router(this);

        this.contentRegion = new ContentRegion();
        this.headerRegion = new HeaderRegion();
        this.headerBackgroundRegion = new HeaderBackgroundRegion();
        this.leftPanelRegion = new LeftPanelRegion();
        this.rightPanelRegion = new RightPanelRegion();

        this.addInitializer(this.routingStarted);
    }

    private routingStarted() {
        if( ! Backbone.History.started ) {
            Backbone.history.start();
        }
	}

    public showMain() {
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
            }],
            user:{
                username: 'pingheschool',
                full_name:  '平和学校',
                user_image: '/core/img/school-logo-pinghe-login.png'
            },
            school:{
                school_name: '平和学校',
                school_logo: '/core/img/school-logo-pinghe-login-white.png'
            }
        };
        var splitViewLayout = new SplitViewLayout();
        var headerView = new HeaderView(headerContext);
        var headerBackgroundView = new HeaderBackgroundView();
        var feedCenterView = new FeedCenterView();

        this.headerRegion.show(headerView);
        this.headerBackgroundRegion.show(headerBackgroundView);
//        $('#main-content').append(splitViewLayout.render());
        this.contentRegion.show(splitViewLayout);
        splitViewLayout.rightPanel.show(feedCenterView);

        headerBackgroundView.collapse();
        feedCenterView.updateTime();

    }
 }

$(() => {
	var app = new App();
    app.start();
});

export = App;
