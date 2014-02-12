/// <reference path="../vendor/angular/angular.d.ts"/>

interface IControllerScope extends ng.IScope {
    ctrl: any;
}

interface IMainControllerScope extends IControllerScope {

}

interface ILoginControllerScope extends IControllerScope {
    ctrl: any;
    username: string;
    password: string;
}

