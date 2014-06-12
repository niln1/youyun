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
    }
    View.prototype.start = function () {
        this.dontPickupList = [];
        this.totalPickupList = [];
        this.getTotalStudentNeedPickup();
    };
    View.prototype.loadData = function () {};
    View.prototype.reRender = function () {
        this.$prepickupList.find(".need-pickup").html(this.totalPickupList.length - this.dontPickupList.length);
        this.$prepickupList.find(".dont-pickup").html(this.dontPickupList.length);
        this.$prepickupList.find(".total").html(this.totalPickupList.length);
    };
    View.prototype.parsePickupStudentList = function (data) {
        this.totalPickupList = data.result;
        this.reRender();
    };
    View.prototype.getTotalStudentNeedPickup = function () {
        var url = "/api/v1/users";
        var data = {
            signature: "tempkey",
            userType: 3,
            isPickUp: 1
        };
        $.get(url, data, $.proxy(this.parsePickupStudentList, this));
    };
    return View;
})();

$(function () {
    app = new pickupReportApp();
    app.start();
});