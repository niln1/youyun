/*
 * file: pickupReport.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var app;
var pickupReportApp = (function () {
    /**
     * Constructor for the View
     */
    function View() {
        var self = this;
        this.currentDate = new Date();
        this.currentReport = {};
        this.reports = [];
        this.users = [];
        this.dateArray = [];
        this.$notifications = $("#notifications");
        this.$prepickupList = $("#prepickup-list");
        this.$absenceTable = $("#absence-table");
        this.$calendar = $("#calendar");
        this.$rightReportContainer = $("#right-panel-container");
        this.$addReportModal = $("#add-report-modal");
        this.$addReportFooter = this.$addReportModal.find(".modal-footer").click($.proxy(this.addReportHandler, this));
        this.notifications = this.$notifications.kendoNotification({width: 300}).data("kendoNotification");
    }

    function populateUsersHelper (userIds, users) {
        return _.filter(users, function(user){ return _.contains(userIds, user._id) });
    }

    /**
     * Loading the initialization functions
     * @return {[type]} [description]
     */
    View.prototype.start = function () {
        this._initSocket();
        this._loadData();
        this.reRenderCalendar();
    };

    View.prototype._loadData = function () {
        this._getUserList();
    };

    View.prototype._initSocket = function () {
        var self = this;
        this.socket = io.connect();
        this.socket.emit("pickup::all::get-current-report");
        this.socket.emit("pickup::teacher::get-reports");
        this.socket.on("pickup::create::success", function onCreateSuccess(data) {
            self.notifications.show("Successfully Created", "success");
            self.$addReportModal.modal("hide");
            self.socket.emit("pickup::teacher::get-reports");
        });
        this.socket.on("pickup::teacher:update-reports", function onUpdateReports(data) {
            self.reports = data;
            self.notifications.show("Updating report", "info");
            self.reRenderCalendar();
            self.displayReportByDate(self.currentDate);
        });
        this.socket.on("pickup::all:error", function onAllError(data) {
            self.notifications.show(data, "error");
        });
        this.socket.on("pickup::create::error", function onCreateError(data) {
            self.notifications.show(data, "error");
            self.$addReportModal.modal("hide");
        });
        this.socket.on("pickup::all::picked-up::success", function dummy(data) {
            _.each(self.reports, function (report) {
                if (report._id === data._id) {
                    report = data;
                }
            });

            if (data._id === self.currentReport._id) {
                self.currentReport = data;
                self.renderCurrentReport()
            };
        });
        this.socket.on("pickup::all::add-absence::success", function dummy(data) {
            _.each(self.reports, function (report) {
                if (report._id === data._id) {
                    report = data;
                }
            });

            if (data._id === self.currentReport._id) {
                self.currentReport = data;
                self.renderCurrentReport()
            };
        });
    };

    /**
     * Emit the userlist and date to create report socket if click on save button
     * @param event [click event]
     */
    View.prototype.addReportHandler = function (event) {
        if (event.target.type === "button"){
            if (event.target.id === "save-new-report") {
                var date = moment(new Date(this.currentDate));
                var users = _.filter(this.users, function(user) {return user.pickupLocation && user.userType === 3});
                var userIds = _.pluck(users, '_id');
                if (date.isValid()) {
                    this.socket.emit("pickup::create-report",{ date: date.format(), userIds: userIds })
                } else {
                    throw Error("invalid date");
                }
            }
        }
    };

    View.prototype.reRenderCalendar = function () {
        var self = this;
        this.$calendar.empty();
        this.dateArray = _.map(this.reports, function(data) { return moment(new Date(data.date)).format("L"); });
        return $("#calendar").kendoCalendar({
            value: self.currentDate,
            // get the date array with date value
            dates: self.dateArray,
            month:{
                content: 
                    '# if ($.inArray(moment(data.date).format("L"), data.dates)!=-1) { #' +
                        '<div class="pickup_date">#= data.value #</div>' +
                    '# } else { #' +
                        '#= data.value #' +
                    '# } #',
            },
            footer: false,
            navigate: function() {
                var view = this.view();
                console.log(view.name); //name of the current view

                var current = this.current();
                console.log(current); //currently focused date
            },
            change: function() {
                self.currentDate = this.value();
                self.displayReportByDate(this.value());
            }
        });
    };

    View.prototype.displayReportByDate = function (date) {
        if ($.inArray(moment(date).format("L"), this.dateArray)!=-1) {
            this.$rightReportContainer.html($("#report-template").html());
            this.currentReport = _.find(this.reports, function(report) {
                return report.date ? ( moment( new Date(report.date) ).format("L") === moment(date).format("L")) : false;
            });
            this.renderCurrentReport();
        } else {
            var today = new Date().setHours(0,0,0,0);
            // if less than yesterday
            if (date.getTime() < today) {
                this.$rightReportContainer.html($("#past-no-report-template").html());
            } else {
                this.$rightReportContainer.html($("#future-no-report-template").html());
                this.$addReportButton = $("#add-report-button").click($.proxy(this.showCreateReportModal, this));
            }
        }
    };

    View.prototype.showCreateReportModal = function () {
        this.$addReportModal.find(".create-report-date").html(moment(this.currentDate).format("YYYY/MM/DD"));
        this.$addReportModal.modal("show");
    };

    View.prototype.renderCurrentReport = function () {
        var report = this.currentReport;
        $("#need-pickup-total").html(report.needToPickupList.length);
        $("#pickedup-total").html(report.pickedUpList.length);
        $("#absence-total").html(report.absenceList.length);

        this.renderReportTableWithSelectorAndData("#right-panel-container .absence-table",
            populateUsersHelper(report.absenceList, this.users));

        // calculate the data and populate the pickup table
        var needToPickupList = _.map(populateUsersHelper(report.needToPickupList, this.users), function(student) {
            student.picked = false;
            return student;
        });
        var pickedupList = _.map(populateUsersHelper(report.pickedUpList, this.users), function(student) {
            student.picked = true;
            return student;
        });
        this.currentReport.pickupData = _.sortBy(_.union(needToPickupList, pickedupList), function(student){ return student.pickupLocation; });
        this.renderReportTableWithSelectorAndData("#right-panel-container .need-pickup-table",
            this.currentReport.pickupData);
        
    };

    View.prototype.renderReportTableWithSelectorAndData = function (selectorString, data){
        $(selectorString).kendoGrid({
            dataSource: {
                data: data,
            },
            sortable: true,
            columns: [{
                field: "pickup",
                title: "Pickup",
                width: "35px",
                template: '<div class="pickup-table-checkmark #= picked ? "ion-ios7-checkmark-outline" : "ion-ios7-circle-outline" #"></div>'
            },{
                field: "firstname",
                title: "First Name",
            }, {
                field: "lastname",
                title: "Last Name",
            }, {
                field: "pickupLocation",
                title: "Pick Up Location",
            }]
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
    };
    View.prototype._getUserList = function () {
        var url = "/api/v1/users";
        var data = {
            signature: "tempkey"
        };
        $.get(url, data, $.proxy(this.parseUserList, this));
    };
    return View;
})();

$(function () {
    app = new pickupReportApp();
    app.start();
});