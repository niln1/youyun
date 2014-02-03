
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

        angular.bootstrap(document, ['YouyunApp']);
	}
}

$(() => {
	App.I = new App();
});

export = App;
