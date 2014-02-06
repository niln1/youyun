/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>

class Controller {
    constructor ($scope:IControllerScope) {
        $scope.ctrl = this;
    }
}

export = Controller;