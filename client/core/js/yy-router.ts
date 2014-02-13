/**
 * Created by Nil on 2/7/14.
 */

/// <reference path='vendor/backbone/marionette.d.ts'/>
import Auth = require('./auth');

class YYRouter extends Marionette.AppRouter {

    public static instance:YYRouter;
    public static get I():YYRouter {
        if (!YYRouter.instance) return null;
        return YYRouter.instance;
    }

    constructor (private controller : any) {
        super({
            controller: controller,
            appRoutes: {
                "": "showMain",
                "login": "showLogin"
            }
        });
        YYRouter.instance = this;

        this.bind('route', this.onRouteChanged);
    }

    private onRouteChanged(route?:string, params?:any[]) {
        Auth.I.checkAuthentication();
    }
}

export = YYRouter;
