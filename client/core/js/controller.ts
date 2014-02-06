/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>
/// <reference path='interface/auth.d.ts'/>

class Controller {

    http:ng.IHttpService;
    location:ng.ILocationService;
    auth: IAuth;

    constructor ($scope:IControllerScope, $http: ng.IHttpService, $location: ng.ILocationService, $auth: IAuth) {
        $scope.ctrl = this;
        this.http = $http;
        this.location = $location;
        this.auth = $auth;
    }
}

export = Controller;