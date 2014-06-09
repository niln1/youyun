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
        var orderedStudents = _.sortBy(this.students, function (student) {
            return student.firstname;
        });
        _.each(orderedStudents, function (student) {
            var templateString = "<tr><td><% if(firstname) return firstname %></td>\
            <td><% if(lastname) return lastname %></td>\
            <td><% if(pickupLocation) return pickupLocation %></td>\
            <td><%= username %></td>\
            <td>hello</td></tr>";
            var template = _.template(templateString);
            $("tbody", "#student-table").append(template(student));
        });
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