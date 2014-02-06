/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/model.d.ts'/>

import Controller = require('controller')
import Authentication = require('authentication')

class LoginController extends Controller {
    public static LOGIN_API_URL : string = '/api/v1/account/login';

    private scope:ILoginControllerScope;

    constructor (private $scope:ILoginControllerScope, private $auth : Authentication) {
        super($scope);
        console.log('Login Controller');
    }

    doLogin () : void {
        this.$auth.login(this.$scope.username, this.$scope.password);
    }
}

export = LoginController;