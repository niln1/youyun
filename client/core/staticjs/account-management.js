/*
 * file: accountmanagment.js
 * Copyright (c) 2014, Tracy. All rights reserved.
 */

// quick code

"use strict";
var app;

var acc = (function () {
    /**
     * Constructor for the View
     */
    function View() {
        var self = this;
        this.currentDate = new Date();
        this.currentReport = {
            needToPickupList: [],
            absenceList: [],
            pickedUpList: []
        };
    }

    
    /**
     * Loading the initialization functions
     * @return {[type]} [description]
     */
    View.prototype.start = function () {
        this._updateSelectors();

        this._bindEvents();
    };

    View.prototype._updateSelectors = function () {
        this.$oldPassword  = $("#oldPassword");
        this.$newPassword1 = $("#newPassword1");
        this.$newPassword2 = $("#newPassword2");
        this.$infoField    = $("#info-field");
        this.$changePwdBtn = $("#change-pwd-btn");
    };

    View.prototype._bindEvents = function() {
        var self = this;

        this.$changePwdBtn.click($.proxy(this.changePassword, this));

        this.$oldPassword.focus(this._clearError);

        this.$newPassword1.focus(this._clearError);

        this.$newPassword2.focus(this._clearError);
    };

    View.prototype._clearError = function(event) {
        $(event.target).parent().removeClass('has-error');
    };

    View.prototype.changePassword = function() {
        var self = this;
        self._clearErrors();

        var oldPassword = self.$oldPassword.val();
        var newPassword1 = self.$newPassword1.val();
        var newPassword2 = self.$newPassword2.val();

        if(!oldPassword) {
            self.$oldPassword.parent().addClass('has-error');
            self._showErrorMessage("please fill in the fields");
            return;
        }
        if(!newPassword1) {
            self.$newPassword1.parent().addClass('has-error');
            self._showErrorMessage("please fill in the fields");
            return;
        }
        if(!newPassword2) {
            self.$newPassword2.parent().addClass('has-error');
            self._showErrorMessage("please fill in the fields");
            return;
        }
        if(newPassword1 !== newPassword2) {
            self._showErrorMessage("repeat password not match");
            return;
        } else {
            var data = {
                'oldPassword': oldPassword,
                'newPassword': newPassword1,
                'signature': 'tempkey'
            };
            $.ajax({
                url : '/api/v1/account/password',
                data : JSON.stringify(data),
                type : 'POST',
                contentType: "application/json",
                dataType: "json"
            }).then(function() {
                self.$infoField.text("password updated");
                self.$infoField.addClass('success-message');
            }).fail(function(e) {
                self.$infoField.text("failed to update password, please make sure the credential is correct");
                self.$infoField.addClass('error-message');
            }).always(function() {
                self.$infoField.show();
            });   
        }
    };

    View.prototype._showErrorMessage = function(message) {
        this.$infoField.text(message);
        this.$infoField.addClass('error-message');
        this.$infoField.show();
    };

    View.prototype._clearErrors = function() {
        this.$infoField.text('');
        this.$infoField.hide();
        this.$infoField.removeClass('success-message');
        this.$infoField.removeClass('error-message');
    };

    return View;
})();

$(function () {
    app = new acc();
    app.start();
});
