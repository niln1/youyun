/*
 * file: usermanage.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

"use strict";
var app;
var userManageApp = (function () {
    function View() {
        this.$studentTable = $("#student-table");
    }
    View.prototype.start = function () {
        this.users = [];
        this._getUserList();
    };
    View.prototype.renderTable = function () {
        _.each(students, function () {
            var templatestring = "<tr><td> <%= lastname %> </td><td> <%= firstname %></td><td> hello</td><td> hello</td><td> hello</td><td> hello</td></tr>"
            var template = _.template("");
        });
        $("tbody", "#student-table").append(template);
    };
    View.prototype._getUserList = function () {
        var url = "/api/v1/users";
        var data = {
            signature: "tempkey"
        };
        var callback = function (data) {
            this.users = data.result;
            this.students = _.filter(this.users, function (user) {
                return user.userType === 3;
            });
            this.teachers = _.filter(this.users, function (user) {
                return user.userType === 2;
            });
        };
        $.get(url, data, $.proxy(callback, this));
    };
    View.prototype._updateUser = function () {
        var url = "/api/v1/users";
        var data = {
            signature: "tempkey"
        };
        var callback = function (data) {};
        $.put(url, data, $.proxy(callback, this));
    };
    return View;
})();

$(function () {
    app = new userManageApp();
    app.start();
});