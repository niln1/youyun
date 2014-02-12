/// <reference path='interfaces/db.d.ts'/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

import LocalStorage = require('local-storage');
import User = require('user');

interface IAuthenticationSetting {
    isAuthenticated: boolean;
    user: User;
    prevLocation: string;
}

class Auth {
    private static AUTH_COOKIE_KEY : string = 'auth';
    private static LOGIN_API_URL : string = '/api/v1/account/login';
    private static NO_AUTH_PAGES : string[] = [
        '/login',
        '/404'
    ];

    private setting : IAuthenticationSetting;

    constructor() {
        var storedSetting : IAuthenticationSetting = LocalStorage.I.get(Auth.AUTH_COOKIE_KEY);
        if (!storedSetting) {
            this.setting = {
                isAuthenticated : false,
                user : null,
                prevLocation : '/'
            };
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

    public set prevLocation (location : string) {
        this.setting.prevLocation = location;
        this.save();
    }

    public needsAuthentication () : boolean {
        var currLocation = Backbone.history.getFragment();
        return Auth.NO_AUTH_PAGES.indexOf(currLocation) === -1;
        return false;
    }

    public checkAuthentication () {
        var prevLocation = Backbone.history.getFragment();
        if (this.needsAuthentication() && !this.isAuthenticated) {
            this.prevLocation = prevLocation;
            Backbone.history.navigate('login');
        } else if (this.isAuthenticated && prevLocation === 'login') {
            Backbone.history.navigate(prevLocation);
        }
    }

    public login(username : string, password : string) {

    }

    public logout () {

    }

    private save() : void {
        LocalStorage.I.set(Auth.AUTH_COOKIE_KEY, this.setting);
    }
}