/// <reference path='interfaces/db.d.ts'/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

import LocalStorage = require('./local-storage');
import User = require('./models/user');
import Router = require('./router');

interface IAuthenticationSetting {
    isAuthenticated: boolean;
    user: User;
    prevLocation: string;
    errorMessage: string;
}

class Auth {
    private static AUTH_COOKIE_KEY : string = 'auth';
    private static LOGIN_API_URL : string = '/api/v1/account/login';
    private static NO_AUTH_PAGES : string[] = [
        'login',
        '404'
    ];

    public static instance:Auth;
    public static get I():Auth {
        if (!Auth.instance) Auth.instance = new Auth();
        return Auth.instance;
    }

    private setting : IAuthenticationSetting;

    constructor() {
        var storedSetting : IAuthenticationSetting = LocalStorage.I.get(Auth.AUTH_COOKIE_KEY);
        if (!storedSetting) {
            this.setting = {
                isAuthenticated : false,
                user : null,
                prevLocation : '',
                errorMessage : ''
            };
            this.save();
        } else {
            this.setting = storedSetting;
        }
    }

    public get isAuthenticated () : boolean {
        return this.setting.isAuthenticated;
    }

    public get user() : User {
        return this.setting.user;
    }

    public get prevLocation () : string {
        return this.setting.prevLocation;
    }

    public needsAuthentication () : boolean {
        var currLocation = Backbone.history.getFragment();
        return Auth.NO_AUTH_PAGES.indexOf(currLocation) === -1;
    }

    public checkAuthentication () {
        // Circular reference
        var router : Router = require('./router').I;

        var prevLocation = Backbone.history.getFragment();
        if (this.needsAuthentication() && !this.isAuthenticated) {
            this.setting.prevLocation = prevLocation;
            this.save();
            router.navigate('login', { trigger : true });
        } else if (this.isAuthenticated && prevLocation === 'login') {
            router.navigate(this.prevLocation, { trigger : true });
        }
    }

    public login(username : string, password : string) {
        var auth : Auth = this;

        $.post(Auth.LOGIN_API_URL, {
            username: username,
            password: password
        }, function (data) {
            if (data && data.result && data.message) {
                auth.loginSucceeded(data.message);
            } else {
                auth.loginFailed(data.description);
            }
        }).fail(function (data) {
            auth.loginFailed('无法连接到服务器'); // TODO: i18n this
        });
    }

    private loginSucceeded(user : IUserSchema) {
        console.log('success');
        var router : Router = require('./router').I;
        this.setting.user = new User(user);
        this.setting.isAuthenticated = true;
        this.setting.errorMessage = '';
        this.save();
        router.navigate(this.setting.prevLocation, { trigger : true })
    }

    private loginFailed(error) {
        console.log('failure');
        var router : Router = require('./router').I;
        this.setting.user = null;
        this.setting.isAuthenticated = false;
        this.setting.errorMessage = error;
        this.save();
        router.navigate('login', { trigger : true })
    }

    public logout () {

    }

    private save() : void {
        LocalStorage.I.set(Auth.AUTH_COOKIE_KEY, this.setting);
    }
}

export = Auth;