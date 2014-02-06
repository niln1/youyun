
/// <reference path="vendor/angular/angular.d.ts"/>

import LoginController = require('login-controller')

class App {
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

	private module:ng.IModule;

	constructor() {
		this.module = angular.module('YouyunApp', ['ngRoute']);

		this.module.config(['$routeProvider', ($routeProvider) => {
            $routeProvider.
                when('/', {
                    templateUrl: 'core/views/main.html',
                    controller: 'PhoneListCtrl'
                }).
                when('/login', {
                    templateUrl: 'core/views/login.html',
                    controller: LoginController
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

        // Custom object injection
        this.module.factory('$auth', () : IAuth => {
            var auth : IAuth = {
                isAuthenticated: false,
                user: null,
                prevLocation: '/'
            }
            return auth
        });

        // Route redirect event
        this.module.run(function($rootScope, $location, $auth) {
            $rootScope.$on('$routeChangeStart', (event) => {
                // Pages that doesn't need authentication
                var whitelist : string[] = [
                    '/login',
                    '/404'
                ];

                if(!$auth.isAuthenticated && whitelist.indexOf($location.path()) === -1){
                    $auth.prevLocation = $location.path();
                    $location.url("/login");
                }

                event.preventDefault();
            });
        })


        angular.bootstrap(document, ['YouyunApp']);
	}
}

$(() => {
	App.I = new App();
});

export = App;
