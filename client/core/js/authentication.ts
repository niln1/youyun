
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/model.d.ts'/>

class Authentication {

    http: ng.IHttpService;
    user: IUser;
    prevLocation: string;

    constructor($http : ng.IHttpService) {
        this.http = ng.IHttpService;
        this.user = null;
        this.prevLocation = '/';
    }

    public isAuthenticated() : boolean  {
        return false;
    }
}

export = Authentication;