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

        $("#grid").kendoGrid({
            dataSource: {
                data: products,
                schema: {
                    model: {
                        fields: {
                            ProductName: {
                                type: "string"
                            },
                            UnitPrice: {
                                type: "number"
                            },
                            UnitsInStock: {
                                type: "number"
                            },
                            Discontinued: {
                                type: "boolean"
                            }
                        }
                    }
                },
                pageSize: 20
            },
            scrollable: true,
            sortable: true,
            pageable: {
                input: true,
                numeric: false
            },
            columns: ["ProductName",
                {
                    field: "UnitPrice",
                    title: "Unit Price",
                    format: "{0:c}",
                    width: "130px"
                }, {
                    field: "UnitsInStock",
                    title: "Units In Stock",
                    width: "130px"
                }, {
                    field: "Discontinued",
                    width: "130px"
                }]
        });

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

var products = [{
    ProductID: 1,
    ProductName: "Chai",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "10 boxes x 20 bags",
    UnitPrice: 18.0000,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
        CategoryID: 1,
        CategoryName: "Beverages",
        Description: "Soft drinks, coffees, teas, beers, and ales"
    }
}];