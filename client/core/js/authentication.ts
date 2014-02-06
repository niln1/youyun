
/// <reference path="vendor/angular/angular.d.ts"/>
/// <reference path='interface/model.d.ts'/>

interface IAuthenticationSetting {
    isAuthenticated: boolean;
    user: IUser;
    prevLocation: string;
}

class Authentication {

    private static AUTH_COOKIE_KEY : string = 'auth';
    private static LOGIN_API_URL : string = '/api/v1/account/login';
    private static NO_AUTH_PAGES : string[] = [
        '/login',
        '/404'
    ];

    private setting : IAuthenticationSetting;

    constructor(private $http:ng.IHttpService, private localStorageService:ng.ICookieStore, private $location:ng.ILocationService) {
        var storedSetting = <IAuthenticationSetting> localStorageService.get(Authentication.AUTH_COOKIE_KEY);
        if (!storedSetting) {
            this.setting = {
                isAuthenticated : false,
                user : null,
                prevLocation : '/'
            };
            localStorageService.set(Authentication.AUTH_COOKIE_KEY, this.setting);
        } else {
            this.setting = storedSetting;
        }
    }

    public get isAuthenticated () : boolean {
        return this.setting.isAuthenticated;
    }

    public set isAuthenticated (isLoggedIn : boolean) {
        this.setting.isAuthenticated = isLoggedIn;
        this.save();
    }

    public get user() : IUser {
        return this.setting.user;
    }

    public get prevLocation () : string {
        return this.setting.prevLocation;
    }

    public set prevLocation (location : string) {
        this.setting.prevLocation = location;
        this.save();
    }

    public needsAuthentication () : boolean {
        var currLocation = this.$location.path();
        return Authentication.NO_AUTH_PAGES.indexOf(currLocation) === -1;
    }

    public checkAuthentication () {
        if (this.needsAuthentication() && !this.isAuthenticated) {
            this.prevLocation = this.$location.path();
            this.$location.url("/login");
        } else if (this.isAuthenticated && this.$location.path() === '/login') {
            this.$location.url(this.prevLocation);
        }
    }

    public login(username : string, password : string) : ng.IHttpPromise<any> {
        return this.$http.post(Authentication.LOGIN_API_URL, $.param({
            username: username,
            password: password
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success((data, status, headers, config) => {
                if (data && data.result && data.message) { // SUCCESS
                    console.log('Login success');
                    var user : IUser = data.message;
                    this.setting.isAuthenticated = true;
                    this.setting.user = user;
                    this.$location.url(this.prevLocation);
                    this.setting.prevLocation = '/';
                    this.save();
                } else { // FAILURE
                    // TODO show failure
                    console.log('Login failure');
                }
            }).error((data, status, headers, config) => { // ERROR
                // TODO show error
                console.log('Login error');
            });
    }

    public logout() {
        this.setting.user = null;
        this.setting.isAuthenticated = false;
        var currLocation = this.$location.path();
        if (Authentication.NO_AUTH_PAGES.indexOf(currLocation) === -1)
            this.setting.prevLocation = currLocation;

        this.save();
    }

    private save() : void {
        this.localStorageService.set(Authentication.AUTH_COOKIE_KEY, this.setting);
    }
}

export = Authentication;
