/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>

class Controller {

    http:ng.IHttpService;
    location:ng.ILocationService;

    constructor ($scope:ControllerScope, $http: ng.IHttpService, $location: ng.ILocationService) {
        $scope.ctrl = this;
        this.http = $http;
        this.location = $location;
    }
}

export = Controller;