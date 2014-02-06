/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/scope.d.ts'/>
/// <reference path='interface/auth.d.ts'/>

import Controller = require('controller')

class LoginController extends Controller {
    public static LOGIN_API_URL : string = '/api/v1/account/login';

    private scope:ILoginControllerScope;

    constructor ($scope:ILoginControllerScope, $http: ng.IHttpService, $location: ng.ILocationService, $auth:IAuth) {
        super($scope, $http, $location, $auth);
        this.scope = $scope;
        console.log('Login Controller');
    }

    doLogin () : void {
        this.http.post(LoginController.LOGIN_API_URL, $.param({
            username: this.scope.username,
            password: this.scope.password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success((data, status, headers, config) => {
            console.log('Success');
            if (data && data.result && data.message) { // SUCCESS
                var user : IUser = data.message;
                this.auth.isAuthenticated = true;
                this.location.url(this.auth.prevLocation);
                this.auth.prevLocation = '/';
            } else { // FAILURE
                // TODO show failure
            }
        }).error((data, status, headers, config) => { // ERROR
            // TODO show error
            console.log('Error');
        })
    }
}

export = LoginController;