/*
* Kendo UI v2014.1.611 (http://www.telerik.com/kendo-ui)
* Copyright 2014 Telerik AD. All rights reserved.
*
* Kendo UI commercial licenses may be obtained at
* http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function(f, define){
    define([ "./kendo.core" ], f);
})(function(){

(function ($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        proxy = $.proxy,
        keys = kendo.keys,
        CLICK = "click",
        KBUTTON = "k-button",
        KBUTTONICON = "k-button-icon",
        KBUTTONICONTEXT = "k-button-icontext",
        NS = ".kendoButton",
        DISABLED = "disabled",
        DISABLEDSTATE = "k-state-disabled",
        FOCUSEDSTATE = "k-state-focused",
        SELECTEDSTATE = "k-state-selected";

    var Button = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            element = that.wrapper = that.element;
            options = that.options;

            element.addClass(KBUTTON).attr("role", "button");

            options.enable = options.enable && !element.attr(DISABLED);
            that.enable(options.enable);

            that._tabindex();

            that._graphics();

            element
                .on(CLICK + NS, proxy(that._click, that))
                .on("focus" + NS, proxy(that._focus, that))
                .on("blur" + NS, proxy(that._blur, that))
                .on("keydown" + NS, proxy(that._keydown, that))
                .on("keyup" + NS, proxy(that._keyup, that));

            kendo.notify(that);
        },

        events: [
            CLICK
        ],

        options: {
            name: "Button",
            icon: "",
            spriteCssClass: "",
            imageUrl: "",
            enable: true
        },

        _isNativeButton: function() {
            return this.element.prop("tagName").toLowerCase() == "button";
        },

        _click: function(e) {
            if (this.options.enable) {
                this.trigger(CLICK, {event: e});
            }
        },

        _focus: function() {
            if (this.options.enable) {
                this.element.addClass(FOCUSEDSTATE);
            }
        },

        _blur: function() {
            this.element.removeClass(FOCUSEDSTATE);
        },

        _keydown: function(e) {
            var that = this;
            if (!that._isNativeButton()) {
                if (e.keyCode == keys.ENTER || e.keyCode == keys.SPACEBAR) {
                    if (e.keyCode == keys.SPACEBAR) {
                        e.preventDefault();
                        if (that.options.enable) {
                            that.element.addClass(SELECTEDSTATE);
                        }
                    }
                    that._click(e);
                }
            }
        },

        _keyup: function() {
            this.element.removeClass(SELECTEDSTATE);
        },

        _graphics: function() {
            var that = this,
                element = that.element,
                options = that.options,
                icon = options.icon,
                spriteCssClass = options.spriteCssClass,
                imageUrl = options.imageUrl,
                span, img, isEmpty;

            if (spriteCssClass || imageUrl || icon) {
                isEmpty = true;

                element.contents().not("span.k-sprite").not("span.k-icon").not("img.k-image").each(function(idx, el){
                    if (el.nodeType == 1 || el.nodeType == 3 && $.trim(el.nodeValue).length > 0) {
                        isEmpty = false;
                    }
                });

                if (isEmpty) {
                    element.addClass(KBUTTONICON);
                } else {
                    element.addClass(KBUTTONICONTEXT);
                }
            }

            if (icon) {
                span = element.children("span.k-icon").first();
                if (!span[0]) {
                    span = $('<span class="k-icon"></span>').prependTo(element);
                }
                span.addClass("k-i-" + icon);
            } else if (spriteCssClass) {
                span = element.children("span.k-sprite").first();
                if (!span[0]) {
                    span = $('<span class="k-sprite"></span>').prependTo(element);
                }
                span.addClass(spriteCssClass);
            } else if (imageUrl) {
                img = element.children("img.k-image").first();
                if (!img[0]) {
                    img = $('<img alt="icon" class="k-image" />').prependTo(element);
                }
                img.attr("src", imageUrl);
            }
        },

        enable: function(enable) {
            var that = this,
                element = that.element;

            if (enable === undefined) {
                enable = true;
            }

            enable = !!enable;
            that.options.enable = enable;
            element.toggleClass(DISABLEDSTATE, !enable)
                   .attr("aria-disabled", !enable)
                   .attr(DISABLED, !enable);
            element.blur();
        }
    });

    kendo.ui.plugin(Button);

})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });