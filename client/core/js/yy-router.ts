/**
 * Created by Nil on 2/7/14.
 */

/// <reference path='vendor/backbone/marionette.d.ts'/>

class YYRouter extends Marionette.AppRouter {
    constructor (private controller : any) {
        super({
            controller: controller,
            appRoutes: {
                "": "showMain",
                "login": "showLogin"
            }
        });

        console.log('init router');
    }
}

export = YYRouter;