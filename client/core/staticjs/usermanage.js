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

        this.groups = [];

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
                    self.groups =  _.uniq(_.pluck(self.students, 'pickupLocation'));
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
                        studentId: options.data.student,
                        pickedBy: options.data.pickedBy,
                        mondayPickupTime: options.data.mondayPickupTime,
                        tuesdayPickupTime: options.data.tuesdayPickupTime,
                        wednesdayPickupTime: options.data.wednesdayPickupTime,
                        thursdayPickupTime: options.data.thursdayPickupTime,
                        fridayPickupTime: options.data.fridayPickupTime,
                        saturdayPickupTime: options.data.saturdayPickupTime,
                        sundayPickupTime: options.data.sundayPickupTime,
                        signature: "tempkey"
                    };
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        dataType: "json",
                        success: function(result) {
                            options.success();
                            self.pickupDetailDataSource.read();
                        },
                        error: function(result) {
                            common.showError();
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
                            common.showError();
                            options.error(result);
                        }
                    });
                },
                update: function(options) {
                    var submitData = {
                        pickedBy: options.data.pickedBy._id,
                        mondayPickupTime: options.data.mondayPickupTime,
                        tuesdayPickupTime: options.data.tuesdayPickupTime,
                        wednesdayPickupTime: options.data.wednesdayPickupTime,
                        thursdayPickupTime: options.data.thursdayPickupTime,
                        fridayPickupTime: options.data.fridayPickupTime,
                        saturdayPickupTime: options.data.saturdayPickupTime,
                        sundayPickupTime: options.data.sundayPickupTime,
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
                            self.pickupDetailDataSource.read();
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
                        if (each.pickedBy) {
                            each.pickedByTeacherName = each.pickedBy.firstname + ' ' + each.pickedBy.lastname;
                        };
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
                        pickedByTeacherName: { editable: true },
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
                            common.showError();
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
                { field: "studentName", title: "Student Name", width: "11%" },
                { field: "pickedByTeacherName", title: "Picked By", width: "11%" },
                { field: "mondayPickupTime", title:"Mon", width: "8%"},
                { field: "tuesdayPickupTime", title:"Tue", width: "8%"},
                { field: "wednesdayPickupTime", title:"Wed", width: "8%"},
                { field: "thursdayPickupTime", title:"Thu", width: "8%"},
                { field: "fridayPickupTime", title:"Fri", width: "8%"},
                { field: "saturdayPickupTime", title:"Sat", width: "8%"},
                { field: "sundayPickupTime", title:"Sun", width: "8%"},
                { command: ["edit", "destroy"], title: "&nbsp;", width: "22%"},
            ],
            toolbar: [
                { name: "create", text: "Add New" },
                { name: "createGroup", text: "Add By Group (BETA)"}
            ],
            editable: {
                mode: "popup",
                template: kendo.template($("#pickup-popup-editor").html())
            },
            edit: function(e) {
                $(".timepicker").timepicker({ 
                    timeFormat: 'H:i', 
                    useSelect: false ,
                    step: 15,
                    minTime: '11:45',
                    maxTime: '15:15'
                });
                var $student = e.container.find("input[name=student]");
                var $pickedBy = e.container.find("input[name=pickedBy]");

                var addedStudents = _.pluck(self.pickupDetailDataSource.data(), "student");

                // remove added students
                var studentDataLeft = _.filter(self.studentDataSource._data, function(student) {
                    var temp = _.any(addedStudents, function(addedStudent, i, a) {
                        if (addedStudent._id) {
                            return addedStudent._id === student._id;
                        } else {
                            return false;
                        }
                    });
                    return !temp;
                });

                $student.prop('disabled', false);
                $student.kendoDropDownList({
                    optionLabel: "Select Student...",
                    dataSource: studentDataLeft,
                    valuePrimitive: true,
                    filter: "startswith",
                    minLength: 3,   
                    dataTextField: "fullname",
                    dataValueField: "id"
                });
                $pickedBy.kendoDropDownList({
                    optionLabel: "Select Teacher...",
                    dataSource: self.teacherDataSource._data,
                    valuePrimitive: true,
                    filter: "startswith",
                    minLength: 3,   
                    dataTextField: "fullname",
                    dataValueField: "_id"
                });
                if (!e.model.isNew()) {
                    $("#student-input-wrapper").hide();
                }
            }
        });

        function submitModalData() {
            var $formInputs= $('#add-by-group-modal input.k-input');
            var data = {};
            _.each($formInputs, function(input) {
                data[input.name] = input.value;
            })
            console.log(data);
        }

        $('.k-grid-createGroup').on('click.addByGroup', function(e){
            var $modal = $('#add-by-group-modal');
            $modal.html($('#add-by-group-modal-editor').html());
            if (!$modal.data('kendoWindow')) {
                $modal.kendoWindow({
                    width: '400px',
                    title: 'Add Student By Group',
                    modal: true,
                    actions: [
                        "Close"
                    ],
                    // close: onClose
                });
            }
            $(".timepicker").timepicker({ 
                timeFormat: 'H:i', 
                useSelect: false ,
                step: 15,
                minTime: '11:45',
                maxTime: '15:15'
            });

            // assign group drop down
            var $group = $modal.find("input[name=group]");

            $group.kendoDropDownList({
                optionLabel: "Select Group...",
                dataSource: self.groups,
                valuePrimitive: true,
                filter: "startswith",
                minLength: 3
            });

            // picked By drop down
            var $pickedBy = $modal.find("input[name=pickedBy]");

            $pickedBy.kendoDropDownList({
                optionLabel: "Select Teacher...",
                dataSource: self.teacherDataSource._data,
                valuePrimitive: true,
                filter: "startswith",
                minLength: 3,   
                dataTextField: "fullname",
                dataValueField: "_id"
            });

            $modal.find('.k-grid-update')
            .off('.addByGroupSubmit')
            .on('click.addByGroupSubmit', function(e) {
                submitModalData();
            });
            $modal.data('kendoWindow').center().open();
        });
    };
    return View;
})();

$(function () {
    app = new studentManageApp();
    app.start();
});