/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyApp = require('../../cy-app');
import CyView = require('./cy-view');
import CyUser = require('../../cy-user');
import CyWidget = require('../component/cy-widget');
import CyAnalytics = require('../../cy-analytics');
import CyTemplates = require('../../util/cy-templates');

/**
 * this is view within the app class. It has nothing to do with the model-view paradigm
 */
class CyLoginView extends CyView {

    /**
     * constructor takes an optional redirect URL. This will be navigated to after a successful login, otherwise
     * it will navigate to the homepage
     *
     * @param redirect
     */
        constructor(private redirect?:string) {

        // super first as required, indicating we don't want user verification in this case

        super("CyLoginView");

        // hide navigation headers for this view

        CyApp.I.hideNavigationHeaders();
    }

    /**
     * initialize the view
     */
    public buildElement():JQuery {

        // get elements

        this.loginElement = CyTemplates.cloneTemplate('cyan-login-template');

        this.loginElement.i18n();

        this.userName = $('[data-element="username"]', this.loginElement);

        this.password = $('[data-element="password"]', this.loginElement);

        this.button = $('[data-element="submit"]', this.loginElement);

        this.alert = $('[data-element="alert"]', this.loginElement);

        // sink sign in click

        this.button.click(() => {

            // handle submission

            this.onSubmit();

            // prevent default submit action

            return false;
        });

        // return outer element

        return this.loginElement;

    }

    /**
     * login outer container
     */
    private loginElement:JQuery;

    private userName:JQuery;

    private password:JQuery;

    private button:JQuery;

    private alert:JQuery;

    /**
     * submit handler for form, actuall cancels the submission and uses ajax instead
     */
    private onSubmit():void {

        // track

        CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kLOGIN_ATTEMPT);

        // hide error message from any previous attempt

        this.alert.addClass("cyan-login-alert-hidden");

        // create a user object to handle the login request

        var user:CyUser = new CyUser();

        user.doLogin(this.userName.val().trim(), this.password.val().trim(), $.proxy(this.afterLogin, this));

        // remove any text from password box

        this.password.val("");
    }

    /**
     * after getting the response for the login request
     * @param user
     * @param result`
     * @param message
     */
    private afterLogin(user:CyUser, result:boolean, message?:string):void {

        if (result) {

            // track

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kLOGIN_SUCCESS);

            // either redirect to the user supplied url/fragment or go to the homepage

            if (this.redirect) {

                CyApp.I.go(this.redirect);

            } else {

                CyApp.I.goHome();
            }
        }
        else {

            // track

            CyAnalytics.I.track(CyAnalytics.kOPERATE, CyAnalytics.kLOGIN_FAILURE);

            // show error message

            this.alert.removeClass('cyan-login-alert-hidden');

        }
    }

    /**
     * dispose the view, clean up, remove event handlers etc etc
     */
    public dispose():void {

        super.dispose();

    }
}

export = CyLoginView

