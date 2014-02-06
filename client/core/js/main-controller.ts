
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>

import Controller = require('controller');

class MainController extends Controller {
    constructor ($scope:IMainControllerScope, $http: ng.IHttpService, $location: ng.ILocationService, $auth:IAuth) {
        super($scope, $http, $location, $auth);
    }
}

export = MainController;