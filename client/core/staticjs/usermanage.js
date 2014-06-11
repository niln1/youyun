/*
 * file: usermanage.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

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
    // super bad rework when feeling like it
    View.prototype._renderTable = function () {
        var orderedStudents = _.sortBy(this.students, function (student) {
            return student.firstname;
        });
        _.each(orderedStudents, function (student) {
            if (!student.pickupLocation) student.pickupLocation = "";
            var templateString = "<tr>\
            <td><%= username %></td>\
            <td><%= firstname %> <%= lastname %></td>\
            <td><%= pickupLocation %></td>\
            </tr>";
            var template = _.template(templateString, student);
            // i18n
            var result = $(template).click($.proxy(function () {
                $('#student-manage-modal').modal('show')
            }), this);
            $("tbody", "#student-table").append(result);
        });
    };
    View.prototype.parseUserList = function (data) {
        this.users = data.result;
        this.students = _.filter(this.users, function (user) {
            return user.userType === 3;
        });
        this.teachers = _.filter(this.users, function (user) {
            return user.userType === 2;
        });
        this._renderTable();
    };
    View.prototype._getUserList = function () {
        var url = "/api/v1/users";
        var data = {
            signature: "tempkey"
        };
        $.get(url, data, $.proxy(this.parseUserList, this));
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