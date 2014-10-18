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
        this.$teacherTableContainer = $("#teacher-table-container");
        this.$pickupDetailTableContainer = $("#pickupdetail-table-container");

        this.studentDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    var url = "/api/v1/users";
                    var data = {
                        signature: "tempkey",
                        userType: 3
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
                    self.students = response.result;
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
                    }
                }
            }
        });

        this.pickupDetailDataSource = new kendo.data.DataSource({
            transport: {
                create: function (options) {
                    var url = "/api/v1/studentpickupdetails";
                    var data = {
                        signature: "tempkey",
                    };
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: data,
                        success: function(result) {
                          options.success(result);
                        },
                        error: function(result) {
                          options.error(result);
                        }
                    });
                },
                read: function (options) {
                    var url = "/api/v1/studentpickupdetails";
                    var data = {
                        signature: "tempkey",
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
                        signature: "tempkey"
                    };
                    $.ajax({
                        url: "/api/v1/studentpickupdetails/"+options.data._id,
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
                        url: "/api/v1/studentpickupdetails/" + options.data._id + "?signature=" + signature,
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
                    var data = _.map(response.result, function(each){
                        each.studentName = each.student.firstname + ' ' + each.student.lastname;
                        return each;
                    });
                    self.pickupDetails = data;

                    return self.pickupDetails;
                },
                model: {
                    id: "_id",
                    fields: {
                        student: { },
                        studentName: { editable: true },
                        pickedBy: { editable: true },
                        mondayPickupTime: { validation: { required: false } },
                        tuesdayPickupTime: { validation: { required: false } },
                        wednesdayPickupTime: { validation: { required: false } },
                        thursdayPickupTime: { validation: { required: false } },
                        fridayPickupTime: { validation: { required: false } },
                        saturdayPickupTime: { validation: { required: false } },
                        sundayPickupTime: { validation: { required: false } }
                    }
                }
            }
        });

        this.teacherDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    var url = "/api/v1/users";
                    var data = {
                        signature: "tempkey",
                        userType: 2
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
                    self.students = response.result;
                    return self.students;
                },
                model: {
                    id: "_id",
                    fields: {
                        username: { editable: false, nullable: false },
                        firstname: { validation: { required: true } },
                        lastname: { validation: { required: true } }
                    }
                }
            }
        });
    }
    View.prototype.start = function () {
        this._renderTable();
    };

    View.prototype._renderTable = function () {
        var self = this;
        // Student info table
        this.$studentTableContainer.kendoGrid({
            dataSource: this.studentDataSource,
            sortable: true,
            columns: [
                { field: "username", title: "Username", width: "70px" },
                { field: "firstname", title: "First Name", width: "80px" },
                { field: "lastname", title:"Last Name", width: "80px" },
                { field: "pickupStudentGrade", title:"Grade", width: "40px" },
                { field: "pickupStudentRoomNumber", title:"Room", width: "40px" },
                { field: "pickupLocation", title:"PickupLocation", width: "120px" },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "130px" },
            ],
            editable: "inline"
        });

        this.$teacherTableContainer.kendoGrid({
            dataSource: this.teacherDataSource,
            sortable: true,
            columns: [
                { field: "username", title: "Username", width: "1%" },
                { field: "firstname", title: "First Name", width: "1%" },
                { field: "lastname", title:"Last Name", width: "1%" },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "1%" },
            ],
            editable: "inline"
        });

        // Pickup Detail Table
        this.$pickupDetailTableContainer.kendoGrid({
            dataSource: this.pickupDetailDataSource,
            sortable: true,
            columns: [
                { field: "studentName", title: "Student Name", width: "120px" },
                { field: "pickedBy", title: "Picked By", width: "80px" },
                { field: "mondayPickupTime", title:"Mon", width: "50px"},
                { field: "tuesdayPickupTime", title:"Tue", width: "50px"},
                { field: "wednesdayPickupTime", title:"Wed", width: "50px"},
                { field: "thursdayPickupTime", title:"Thu", width: "50px"},
                { field: "fridayPickupTime", title:"Fri", width: "50px"},
                { field: "saturdayPickupTime", title:"Sat", width: "50px"},
                { field: "sundayPickupTime", title:"Sun", width: "50px"},
                { command: ["edit", "destroy"], title: "&nbsp;", width: "130px"},
            ],
            toolbar: [
                { name: "create", text: "Add New" }
            ],
            editable: {
                mode: "popup",
                template: kendo.template($("#pickup-popup-editor").html())
            },
            edit: function(e) {
                $(".timepicker").timepicker({ timeFormat: 'H:i', useSelect: false });
                var $studentName = e.container.find("input[name=studentName]");
                var $pickedBy = e.container.find("input[name=pickedBy]");
                $studentName.prop('disabled', false);
                $studentName.kendoDropDownList({
                    optionLabel: "Select Student...",
                    dataSource: self.studentDataSource._data,
                    valuePrimitive: true,
                    filter: "startswith",
                    minLength: 3,   
                    dataTextField: "username",
                    dataValueField: "id"
                });
                $pickedBy.kendoDropDownList({
                    optionLabel: "Select Teacher...",
                    dataSource: self.teacherDataSource._data,
                    valuePrimitive: true,
                    filter: "startswith",
                    minLength: 3,   
                    dataTextField: "username",
                    dataValueField: "id"
                });
                if (!e.model.isNew()) {
                    $studentName.prop('disabled', true);
                }
            }
        });
    };
    return View;
})();

$(function () {
    app = new studentManageApp();
    app.start();
});