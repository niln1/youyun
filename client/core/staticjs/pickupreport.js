/*
 * file: pickupReport.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var app;
var timezone = 'America/Los_Angeles';
moment.tz.setDefault(timezone);
var pickupReportApp = (function () {
    /**
     * Constructor for the View
     */
    function View() {
        var self = this;
        this.currentDate = new Date();
        this.currentReport = {
            needToPickupList: [],
            absenceList: [],
            pickedUpList: []
        };
        this.reports = [];
        this.users = [];
        this.dateArray = [];
        this.$notifications = $('#notifications');
        this.$reportSubInfo = $('#report-sub-info');
        this.$statusPill = $('#status-pill');
        this.$prepickupList = $('#prepickup-list');
        this.$absenceTable = $('#absence-table');
        this.$pickedTable = $('#picked-table');
        this.$needPickupTable = $('#need-pickup-table');
        this.$calendar = $('#calendar');
        this.$rightReportContainer = $('#right-panel-container');
        this.$addReportModal = $('#add-report-modal');
        this.$addReportFooter = this.$addReportModal.find('.modal-footer').click($.proxy(this.addReportHandler, this));
        this.notifications = this.$notifications.kendoNotification({
            width: 300,
            autoHideAfter: 2500,
            button: true
        }).data('kendoNotification');

    }

    function populateUsersHelper (userIds, users) {
        return _.filter(users, function(user){ return _.contains(userIds, user._id) });
    }
    
    /**
     * Loading the initialization functions
     * @return {[type]} [description]
     */
    View.prototype.start = function () {
        this._updateSelectors();
        this._initSocket();
        this._loadData();
        this.reRenderCalendar();
    };

    View.prototype._updateSelectors = function () {
        this.$absenceTable = $("#absence-table");
        this.$pickedTable = $("#picked-table");
        this.$needPickupTable = $("#need-pickup-table");
    };

    View.prototype._loadData = function () {
        this._getUserList();
    };

    /**
     * _updateSocketStatus
     * [description]: update the status pill info
     * status[string]: success, error, info
     * message[string]
     */
    View.prototype._updateSocketStatus = function (status, message) {
        var self = this;
        this.$statusPill.attr('yy-status', status);
        this.$statusPill.find('.info').text(message);
        this.$statusPill.find('.hover-info').text(message);
    };

    View.prototype._initSocket = function () {
        var self = this;
        var reconnectCounter = 0;
        var loaded = false;
        this.socket = io.connect('/', {});

        this.socket.on('connect', function () {
            reconnectCounter = 0;
            self._updateSocketStatus('success', 'Connected');
            self.notifications.show('Connected to Server', 'success');
            self.socket.emit('pickup::teacher::get-reports');
            // resend the message to try fallback race condition
            setTimeout(function() {
                if (loaded === false) {
                    self.socket.emit('pickup::teacher::get-reports');
                };
            }, 5000);
        });

        this.socket.on('reconnecting', function () {
            reconnectCounter += 1;
            self._updateSocketStatus('info', 'Reconnecting')
            self.notifications.show('Attempting to reconnect #' + reconnectCounter, 'info');
        });

        this.socket.on('disconnect', function onDisconnect() {
            self._updateSocketStatus('error', 'Disconnected')
            self.notifications.show('Lost Connection to Server', 'error');
        });

        this.socket.on('pickup::create::success', function onCreateSuccess(data) {
            self.notifications.show('Successfully Created', 'success');
            self.$addReportModal.modal('hide');
            self.socket.emit('pickup::teacher::get-reports');
        });
        this.socket.on("pickup::teacher:update-reports", function onUpdateReports(data) {
            loaded = true;
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
        this.socket.on("pickup::all::picked-up::success", function onPickUpSuccess(data) {
            self.notifications.show("Student get picked up", "info");
            self.socket.emit("pickup::teacher::get-reports");
        });
        this.socket.on("pickup::all::add-absence::success", function onAddAbsenceSuccess(data) {
            //self.notifications.show("...", "info");
            self.socket.emit("pickup::teacher::get-reports");
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
                if (date.isValid()) {
                    this.socket.emit("pickup::create-report",{ date: date.format() })
                } else {
                    throw Error("invalid date");
                }
            }
        }
    };

    View.prototype.reRenderCalendar = function () {
        var self = this;
        this.$calendar.empty();
        this.dateArray = _.map(this.reports, function(data) { return moment(new Date(data.date)).utc().format("L"); });
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
                var current = this.current();
            },
            change: function() {
                self.currentDate = this.value();
                self.displayReportByDate(this.value());
            }
        });
    };

    View.prototype.displayReportByDate = function (date) {
        this.$statusPill.find('.info').text(moment(date).format("L"));
        if ($.inArray(moment(date).format("L"), this.dateArray)!=-1) {
            this.$rightReportContainer.html($("#report-template").html());
            this._updateSelectors();
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
                this.$addReportButton = $("#add-report-button")
                    .click($.proxy(this.showCreateReportModal, this));
            }
        }
    };

    View.prototype.showCreateReportModal = function () {
        this.$addReportModal.find(".create-report-date")
            .html(moment(this.currentDate).format("YYYY/MM/DD"));
        this.$addReportModal.modal("show");
    };

    View.prototype.renderCurrentReport = function () {
        var report = this.currentReport;
        $("#need-pickup-total").html(report.needToPickupList.length);
        $("#picked-total").html(report.pickedUpList.length);
        $("#absence-total").html(report.absenceList.length);
    
        if (this.$absenceTable.data('kendoGrid')) {
            this.$absenceTable.data('kendoGrid').refresh();
        } else {
            this.initAbsenceTable();    
        }

        if (this.$needPickupTable.data('kendoGrid')) {
            this.$needPickupTable.data('kendoGrid').refresh();
        } else {
            this.initNeedPickupTable();    
        }

        if (this.$pickedTable.data('kendoGrid')) {
            this.$pickedTable.data('kendoGrid').refresh();
        } else {
            this.initPickedTable();    
        }
    };

    View.prototype.initPickedTable = function () {
        var self = this;
        this.$pickedTable.kendoGrid({
            dataSource: {
                data: self.currentReport.pickedUpList,
            },
            sortable: true,
            columns: [{
                template: '#= student.fullname #',
                field: 'student.fullname',
                title: "Student",
            },{
                template: '#= pickedBy.fullname #',
                field: 'pickedBy.fullname',
                title: 'Picked By',
            }, {
                
                template: '#= kendo.toString(new Date(pickedUpTime), "g") #',
                field: "pickedUpTime",
                title: 'Picked Time',
            }]
        });
    };

    View.prototype.initNeedPickupTable = function () {
        var self = this;
        this.$needPickupTable.kendoGrid({
            dataSource: {
                data: self.currentReport.needToPickupList,
            },
            sortable: true,
            columns: [{
                field: "pickupLocation",
                title: "Location",
            },{
                template: "#= fullname #",
                field: "fullname",
                title: "Student Name",
            }]
        });
    };

    View.prototype.initAbsenceTable = function () {
        var self = this;
        this.$absenceTable.kendoGrid({
            dataSource: {
                data: self.currentReport.absenceList,
            },
            sortable: true,
            columns: [{
                field: "pickupLocation",
                title: "Location",
            },{
                template: "#= firstname # #= lastname #",
                field: "firstname",
                title: "Student Name",
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
