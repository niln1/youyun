/*
 * file: profile.js
 * Copyright (c) 2014, Tracy. All rights reserved.
 */

// quick code

"use strict";
var app;

var profile = (function () {
    /**
     * Constructor for the View
     */
    function View() {
        var self = this;
        this.currentDate = new Date();
    }

    
    /**
     * Loading the initialization functions
     * @return {[type]} [description]
     */
    View.prototype.start = function () {
        this._updateSelectors();

        this._bindEvents();
    };

    View.prototype._updateSelectors = function () {
        this.$userImageInput        = $("input[name='userImage']");
        this.$uploadBtn             = $("#upload-btn");
        this.$imgPreview            = $("#preivew-img");
        this.$userProfileImgForm    = $("#user-profile-image-form");
        this.$modal                 = $("#user-profile-modal");
    };

    View.prototype._bindEvents = function() {
        var self = this;

        this.$userProfileImgForm.on('submit', function(e) {

            e.preventDefault();
            var formData = new FormData(this);

            $.ajax({
                type:'POST',
                url: '/api/v1/users/image',
                data:formData,
                cache:false,
                contentType: false,
                processData: false
            }).then(function() {
                self.$modal.modal('hide');
                
            }).fail(function(e) {
                alert("not ok " + e);
            }).always(function() {

            }); 
        });

    //    this.$uploadBtn.click($.proxy(this.upload, this));

        this.$userImageInput.change($.proxy(this.preview, this));
    };

    View.prototype._clearError = function(event) {
        $(event.target).parent().removeClass('has-error');
    };

    View.prototype.preview = function(event) {
        var self = this;
        var input = event.target;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                console.log(e.target);
                self.$imgPreview.attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    };

    View.prototype.upload = function() {
        console.log("hi");
        var self = this;
        console.log(self.$userImageInput[0].files[0]);
        var formData = new FormData(self.$userImageInput[0].files[0]);
        console.log(formData);
                $.ajax({
                url : '/api/v1/users/image',
                data : formData,
                type : 'POST',
                //contentType: "multipart/form-data",
                cache:false,
                contentType: false,
                processData: false
                }).then(function() {
                alert("ok");
            }).fail(function(e) {
                alert("not ok " + e);
            }).always(function() {
                
            }); 

    };

    View.prototype._showErrorMessage = function(message) {
        this.$infoField.text(message);
        this.$infoField.addClass('error-message');
        this.$infoField.show();
    };

    View.prototype._clearErrors = function() {
        this.$infoField.text('');
        this.$infoField.hide();
        this.$infoField.removeClass('success-message');
        this.$infoField.removeClass('error-message');
    };

    return View;
})();

$(function () {
    app = new profile();
    app.start();
});
