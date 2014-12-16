/*
 * file: common.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

// quick code

"use strict";
var common = {};
common.showError = function () {
    $("#error-modal").modal("show");
};

$('html.touch nav.user').click(function() {
	$('nav.user ul').toggleClass('active');
});