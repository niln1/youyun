/// <reference path="../vendor/angular/angular.d.ts"/>

interface ControllerScope extends ng.IScope {
    ctrl: any
}

interface LoginControllerScope extends ControllerScope {
    ctrl: any
    username: string
    password: string
}

