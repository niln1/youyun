/*
 * file: pickupReport.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var app;
var pickupReportApp = (function () {
    function View() {
        this.$prepickupList = $("#prepickup-list");
        this.$absenceTable = $("#absence-table");
        this.$calender = $("#calender").kendoCalendar();
        this.$addReportButton = $("#add-report-button").click($.proxy(this.addReport, this));
    }
    View.prototype.start = function () {
        this.currentReport = {};
        this.users = [];
        this.initSocket();
        this.loadData();
    };
    View.prototype.loadData = function () {
        this._getUserList();
    };
    View.prototype.initSocket = function () {
        this.socket = io.connect();
        this.socket.emit("pickup::all::get-current-report");
        this.socket.on("pickup::all:update-current-report", $.proxy(this.parseCurrentReport, this));
    };
    View.prototype.parseCurrentReport = function (data) {
        this.currentReport = data;
        this.reRender();
    };
    View.prototype.addReportSubmit = function (data) {
        this.currentReport = data;
        this.reRender();
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