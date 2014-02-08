
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>

import Controller = require('controller');
import Menu = require('menu');

class MainController extends Controller {
    private menu:Menu;

    constructor ($scope:IMainControllerScope, $http: ng.IHttpService, $location: ng.ILocationService) {
        super($scope);
        this.menu = new Menu();
    }
}

export = MainController;