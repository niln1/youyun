/*
 * file: usermanage.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var app;
var userManageApp = (function () {
    function View() {
        var self = this;
        this.$studentTableContainer = $("#student-table-container");
        this.$studentManageModal = $('#student-manage-modal');
        this.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    var url = "/api/v1/users";
                    var data = {
                        signature: "tempkey"
                    };
                    $.ajax({
                        url: url,
                        data: data,
                        success: function(result) {
                          options.success(result);
                        },
                        error: function(result) {
                          options.error(result);
                        }
                    });
                },
                update: function(options) {
                    var submitData = {
                        firstname: options.data.firstname,
                        lastname: options.data.lastname,
                        pickupLocation: options.data.pickupLocation,
                        signature: "tempkey"
                    };
                    $.ajax({
                        url: "/api/v1/users/"+options.data._id,
                        data: JSON.stringify(submitData),
                        type: 'PATCH',
                        contentType: "application/json",
                        dataType: "json",
                        success: function(result) {
                            options.success();
                        },
                        error: function(result) {
                            common.showError();
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                data: function(response) {
                    self.users = response.result;
                    self.students = _.filter(self.users, function (user) {
                        return user.userType === 3;
                    });
                    self.teachers = _.filter(self.users, function (user) {
                        return user.userType === 2;
                    });
                    return self.students;
                },
                model: {
                    id: "_id",
                    fields: {
                        username: { editable: false, nullable: false },
                        firstname: { validation: { required: true } },
                        lastname: { validation: { required: true } },
                        pickupLocation: { validation: { required: false } },
                    }
                }
            }
        });
    }
    View.prototype.start = function () {
        this.users = [];
        this._getUserList();
    };

    View.prototype._renderTable = function () {
        this.$studentTableContainer.kendoGrid({
            dataSource: this.dataSource,
            sortable: true,
            columns: [
                { field: "username", title: "Username", width: "120px" },
                { field: "firstname", title: "First Name", width: "120px" },
                { field: "lastname", title:"Last Name", width: "120px" },
                { field: "pickupLocation", title:"PickupLocation", width: "120px" },
                { command: ["edit"], title: "&nbsp;", width: "50px" }
            ],
            editable: "inline"
        });
    };
    View.prototype._submitStudentEdit = function (event) {
        var submitData = {
            firstname: this.$studentManageModal.find(".firstname-input").val(),
            lastname: this.$studentManageModal.find(".lastname-input").val(),
            pickupLocation: this.$studentManageModal.find(".pickupLocation-input").val()
        };
        this._updateUser(event.data.student, submitData);
        this.$studentManageModal.modal('hide');
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
            this._getUserList();
        };
        $.ajax({
            url: url,
            data: JSON.stringify(data),
            type: 'PATCH',
            contentType: "application/json",
            dataType: "json",
            success: $.proxy(callback, this),
            error: common.showError
        });
    };
    return View;
})();

$(function () {
    app = new userManageApp();
    app.start();
});