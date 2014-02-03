/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>

import Controller = require('controller')

class LoginController extends Controller {
    public static LOGIN_API_URL : string = '/api/v1/account/login';

    private scope:LoginControllerScope;

    constructor ($scope:LoginControllerScope, $http: ng.IHttpService, $location: ng.ILocationService) {
        super($scope, $http, $location)
        this.scope = $scope
        console.log('Login Controller')
    }

    doLogin () : void {
        console.log("Form clicked")
        
        this.http.post(LoginController.LOGIN_API_URL, $.param({
            username: this.scope.username,
            password: this.scope.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success((data, status, headers, config) => {
            console.log('Success');
        }).error((data, status, headers, config) => {
            console.log('Error');
        })
    }
}

export = LoginController;