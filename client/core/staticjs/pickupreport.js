/*
 * file: usermanage.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var app;
var pickupReportApp = (function () {
    function View() {
        this.$studentTable = $("#student-table");
    }
    View.prototype.start = function () {
        this.users = [];
        this._getUserList();
    };
    // super bad rework when feeling like it
    View.prototype.renderTable = function () {
        var orderedStudents = _.sortBy(this.students, function (student) {
            return student.firstname;
        });
        _.each(orderedStudents, function (student) {
            if (!student.pickupLocation) student.pickupLocation = "";
            var templateString = "<tr><td><%= firstname %></td>\
            <td><%= lastname %></td>\
            <td><%= pickupLocation %></td>\
            <td><%= username %></td>\
            </tr>";
            var template = _.template(templateString, student);
            // i18n
            var buttonDiv = $('<button type="button" class="btn btn-default btn-xs">编辑</button>');
            buttonDiv.click($.proxy(function () {
                console.log(student);
            }), this);
            var result = $(template).append($("<td>").append(buttonDiv));
            $("tbody", "#student-table").append(result);
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
    app = new pickupReportApp();
    app.start();
});