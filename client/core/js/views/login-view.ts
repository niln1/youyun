/// <reference path='../vendor/backbone/marionette.d.ts'/>
/// <reference path="../vendor/require/require.d.ts"/>
/// <amd-dependency path='../templates/login-view-tmpl' />

import Auth = require('../auth')

class LoginView extends Backbone.View {

    private template : any;
    private events: Object;

    private static usernameID : string = '#username';
    private $username: JQuery;

    private static passwordID : string = '#password';
    private $password: JQuery;

    private static submitID : string = '#submit';
    private $submit : JQuery;

    constructor() {
        super();

        this.template = require('../templates/login-view-tmpl');

        this.events = {
            'click button#submit': 'login',
            'keydown' : 'keydownHandler'
        }
    }

    public render() : Backbone.View {
        this.setElement(this.template({}));

        this.$username = this.$(LoginView.usernameID);
        this.$password = this.$(LoginView.passwordID);
        this.$submit = this.$(LoginView.submitID);

        return this.el;
    }

    public reset () : void {
        this.$password.val('');
        this.$username.val('').focus();
        console.log('reset');
    }

    public login(event : any) : void {
        if (event) event.preventDefault();

        var success : boolean = false;

        if (this.$username.val().length === 0) {
            this.$username.focus();
            alert('Username can\' be empty'); // TODO: change this
            return;
        }

        if (this.$password.val().length === 0) {
            this.$password.focus();
            alert('Password can\' be empty'); // TODO: change this
            return;
        }

        Auth.I.login(this.$username.val(), this.$password.val());
    }

    public keydownHandler(event : any) : void {
        switch (event.which) {
            case 27: // esc pressed
                this.reset();
            default:
                break;
        }
    }
}

export = LoginView;