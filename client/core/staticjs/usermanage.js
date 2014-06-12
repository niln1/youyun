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
        this.$studentManageModal = $('#student-manage-modal');
    }
    View.prototype.start = function () {
        this.users = [];
        this._getUserList();
    };
    // super bad rework when feeling like it
    View.prototype._renderTable = function () {
        var self = this;
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
            var result = $(template).click(function () {
                // should extract it somewhere else
                self.$studentManageModal.find(".modal-title").html("编辑学生");

                self.$studentManageModal.find(".lastname-input").val(student.lastname);
                self.$studentManageModal.find(".firstname-input").val(student.firstname);
                self.$studentManageModal.find(".pickupLocation-input").val(student.pickupLocation);

                self.$studentManageModal.find(".submit-button").click({
                    student: student,
                    submitData: {
                        firstname: self.$studentManageModal.find(".firstname-input").val(),
                        lastname: self.$studentManageModal.find(".lastname-input").val(),
                        pickupLocation: self.$studentManageModal.find(".pickupLocation-input").val()
                    }
                }, $.proxy(self._submitStudentEdit, self));

                self.$studentManageModal.modal('show');
            });
            self.$studentTable.find("tbody").append(result);
        });
    };
    View.prototype._submitStudentEdit = function (event) {
        console.log(event.data.submitData);
        this._updateUser(event.data.student, event.data.submitData);
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
    View.prototype._updateUser = function (user, data) {
        var url = "/api/v1/users/" + user._id;
        data.signature = "tempkey";
        var callback = function (data) {
            console.log(data);
        };
        $.ajax({
            url: url,
            data: JSON.stringify(data),
            type: 'PATCH',
            contentType: "application/json",
            dataType: "json",
            success: $.proxy(callback, this)
        });
    };
    return View;
})();

$(function () {
    app = new userManageApp();
    app.start();
});