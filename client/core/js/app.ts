
/// <reference path="vendor/angular/angular.d.ts"/>

import MainController = require('main-controller');
import LoginController = require('login-controller');
import Authentication = require('authentication');
import Menu = require('menu');

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
    private http:ng.IHttpService;
    private menu:Menu;

	constructor() {

       this.menu = new Menu();

		// this.module = angular.module('YouyunApp', ['ngRoute', 'LocalStorageModule']);

		// this.module.config(['$routeProvider', ($routeProvider) => {
  //           $routeProvider.
  //               when('/', {
  //                   templateUrl: 'core/views/main.html',
  //                   controller: MainController
  //               }).
  //               when('/login', {
  //                   templateUrl: 'core/views/login.html',
  //                   controller: LoginController
  //               }).
  //               otherwise({
  //                   redirectTo: '/'
  //               });
  //       }]);

  //       // Custom object injection
  //       this.module.factory('$auth', ($http:ng.IHttpService, localStorageService:ng.ICookieStore, $location:ng.ILocationService) => {
  //           return new Authentication($http, localStorageService, $location);
  //       });

  //       // Route redirect event
  //       this.module.run(function($rootScope, $location, $auth) {
  //           $rootScope.$on('$routeChangeStart', (event) => {
  //               $auth.checkAuthentication();
  //               event.preventDefault();
  //           });
  //       })

  //       angular.bootstrap(document, ['YouyunApp']);
	}
}

$(() => {
	App.I = new App();
});

export = App;
