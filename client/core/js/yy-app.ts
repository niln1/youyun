
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

import Router = require('yy-router');

import HeaderView = require('views/header-view');
import HeaderBackgroundView = require('views/header-background-view');
import FeedCenterView = require('views/feed-center-view');

import ContentRegion = require('regions/content-region');
import HeaderRegion = require('regions/header-region');
import HeaderBackgroundRegion = require('regions/header-background-region');
import LeftPanelRegion = require('regions/left-panel-region');
import RightPanelRegion = require('regions/right-panel-region');



class YYApp extends Marionette.Application {
	/**
	 * singleton instance for the app class. Access via the I() public/static method
	 *
	 * @method I
	 * @return {YYApp} A singleton instance of the application.
	 */
	public static instance:YYApp;

	public static get I():YYApp {
		if (!YYApp.instance) YYApp.instance = new YYApp();
		return YYApp.instance;
	}

	public static set I(I:YYApp) {
		YYApp.instance = I;
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

    public showLogin() {
        console.log("here, bitch!");
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
        var headerView = new HeaderView(headerContext);
        var headerBackgroundView = new HeaderBackgroundView();
        var feedCenterView = new FeedCenterView();

        this.headerRegion.show(headerView);
        this.headerBackgroundRegion.show(headerBackgroundView);
        this.rightPanelRegion.show(feedCenterView);

        headerBackgroundView.collapse();
        feedCenterView.updateTime();

    }
 }

$(() => {
	var app = new YYApp();
    app.start();
});

export = YYApp;
