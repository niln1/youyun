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
    };

    View.prototype._loadData = function () {
        this._getUserList();
    };

    View.prototype._initSocket = function () {
        var self = this;
        this.socket = io.connect();
        this.socket.emit("pickup::all::get-current-report");
        this.socket.emit("pickup::teacher::get-reports");
        this.socket.on("pickup::all:update-current-report", $.proxy(this.parseCurrentReport, this));
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
        this.socket.on("pickup::teacher:get-report-for-today", function dummy(data) {
            console.log(data);
        });
    };

    View.prototype.parseCurrentReport = function (data) {
        this.currentReport = data;
        this.reRender();
    };

    /**
     * Emit the userlist and date to create report socket if click on save button
     * @param event [click event]
     */
    View.prototype.addReportHandler = function (event) {
        if (event.target.type === "button"){
            if (event.target.id === "save-new-report") {
                var date = moment(new Date(this.currentDate)).utc();
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
        this.dateArray = _.map(this.reports, function(data) { return new Date(data.date).getTime(); });
        return $("#calendar").kendoCalendar({
            value: self.currentDate,
            // get the date array with date value
            dates: self.dateArray,
            month:{
                content: 
                    '# if ($.inArray(data.date.getTime(), data.dates)!=-1) { #' +
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
        date.setHours(0,0,0,0);
        if ($.inArray(date.getTime(), this.dateArray)!=-1) {
            this.$rightReportContainer.html($("#report-template").html());
            var currentReport = _.find(this.reports, function(report) {
                return report.date ? ( new Date(report.date).getTime() === date.getTime()) : false;
            });
            this.renderReport(currentReport);
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

    View.prototype.renderReport = function (report) {
        $("#need-pickup-total").html(report.needToPickupList.length);
        $("#pickedup-total").html(report.pickedUpList.length);
        $("#absence-total").html(report.absenceList.length);

        if (report.absenceList.length > 0) {
            this.renderReportTableWithSelectorAndData("#right-report-container .absence-table",
                populateUsersHelper(report.absenceList, this.users));
        }
        if (report.needToPickupList.length > 0) {
            this.renderReportTableWithSelectorAndData("#right-report-container .need-pickup-table",
                populateUsersHelper(report.needToPickupList, this.users));
        }
        if (report.pickedUpList.length > 0) {
            this.renderReportTableWithSelectorAndData("#right-report-container .pickedup-table",
                populateUsersHelper(report.pickedUpList, this.users));
        }
    };

    View.prototype.renderReportTableWithSelectorAndData = function (selectorString, data){
        $(selectorString).kendoGrid({
            dataSource: {
                data: data,
            },
            sortable: true,
            columns: [{
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

    View.prototype.reRender = function () {
        if (!$.isEmptyObject(this.currentReport)) {
            // put into listview
            this.$prepickupList.find(".need-pickup").html(this.currentReport.needToPickupList.length
                - this.currentReport.absenceList.length);
            this.$prepickupList.find(".absence").html(this.currentReport.absenceList.length);
            this.$prepickupList.find(".total").html(this.currentReport.needToPickupList.length);

            var tableData = _.filter(this.users, $.proxy(function(student){ 
                return _.contains(this.currentReport.absenceList, student._id) 
            }, this));

            $(this.$absenceTable).kendoGrid({
                dataSource: {
                    data: tableData,
                },
                scrollable: true,
                sortable: true,
                columns: [{
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
        }

    };
    View.prototype.parseUserList = function (data) {
        this.users = data.result;
        this.students = _.filter(this.users, function (user) {
            return user.userType === 3;
        });
        this.teachers = _.filter(this.users, function (user) {
            return user.userType === 2;
        });
        this.reRender();
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