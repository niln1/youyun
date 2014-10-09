/*
 * file: usermanage.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var app;
var studentManageApp = (function () {
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
                },
                destroy: function(options) {
                    var signature = "tempkey";
                    $.ajax({
                        url: "/api/v1/users/" + options.data._id + "?signature=" + signature,
                        type: 'DELETE',
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
                        pickupStudentGrade: { validation: { required: false } },
                        pickupStudentRoomNumber: { validation: { required: false } },
                        pickupLocation: { validation: { required: false } },
                        pickupStudentDayTime: { editable: false, validation: { required: false } },
                    }
                }
            }
        });
    }
    View.prototype.start = function () {
        this.users = [];
        this._renderTable();
    };

    View.prototype._renderTable = function () {
        this.$studentTableContainer.kendoGrid({
            dataSource: this.dataSource,
            sortable: true,
            columns: [
                { field: "username", title: "Username", width: "70px" },
                { field: "firstname", title: "First Name", width: "80px" },
                { field: "lastname", title:"Last Name", width: "80px" },
                { field: "pickupStudentGrade", title:"Grade", width: "40px" },
                { field: "pickupStudentRoomNumber", title:"Room", width: "40px" },
                { field: "pickupLocation", title:"PickupLocation", width: "120px" },
                { command: ["edit"], title: "&nbsp;", width: "60px" },
                { command: ["destroy"], title: "&nbsp;", width: "70px" }
            ],
            editable: "inline"
        });
    };
    return View;
})();

$(function () {
    app = new studentManageApp();
    app.start();
});