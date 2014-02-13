/**
 * Created by Nil on 2/7/14.
 */

/// <reference path='vendor/backbone/marionette.d.ts'/>
import Auth = require('./auth');

class Router extends Marionette.AppRouter {

    public static instance:Router;
    public static get I():Router {
        if (!Router.instance) return null;
        return Router.instance;
    }

    constructor (private controller : any) {
        super({
            controller: controller,
            appRoutes: {
                "": "showMain",
                "login": "showLogin"
            }
        });
        Router.instance = this;

        this.bind('route', this.onRouteChanged);
    }

    private onRouteChanged(route?:string, params?:any[]) {
        Auth.I.checkAuthentication();
    }
}

export = Router;
