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
    View.prototype.start = function () {};
    View.prototype.loadData = function () {};
    View.prototype.getTotalStudentNeedPickup = function () {};
    return View;
})();

$(function () {
    app = new pickupReportApp();
    app.start();
});