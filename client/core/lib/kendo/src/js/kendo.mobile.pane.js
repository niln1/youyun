/*
* Kendo UI v2014.1.611 (http://www.telerik.com/kendo-ui)
* Copyright 2014 Telerik AD. All rights reserved.
*
* Kendo UI commercial licenses may be obtained at
* http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
* If you do not own a commercial license, this file shall be governed by the trial license terms.
*/
(function(f, define){
    define([ "./kendo.mobile.view", "./kendo.mobile.loader" ], f);
})(function(){

(function($, undefined) {
    var kendo = window.kendo,
        mobile = kendo.mobile,
        roleSelector = kendo.roleSelector,
        ui = mobile.ui,
        Widget = ui.Widget,
        ViewEngine = mobile.ViewEngine,
        View = ui.View,
        Loader = mobile.ui.Loader,

        EXTERNAL = "external",
        HREF = "href",
        DUMMY_HREF = "#!",

        NAVIGATE = "navigate",
        VIEW_SHOW = "viewShow",
        SAME_VIEW_REQUESTED = "sameViewRequested",

        WIDGET_RELS = /popover|actionsheet|modalview|drawer/,
        BACK = "#:back",

        attrValue = kendo.attrValue,
        // navigation element roles
        buttonRoles = "button backbutton detailbutton listview-link",
        linkRoles = "tab";

    var Pane = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            options = that.options;
            element = that.element;

            element.addClass("km-pane");

            if (that.options.collapsible) {
                element.addClass("km-collapsible-pane");
            }

            this.history = [];

            this.historyCallback = function(url, params) {
                var transition = that.transition;
                that.transition = null;
                return that.viewEngine.showView(url, transition, params);
            };

            this._historyNavigate = function(url) {
                if (url === BACK) {
                    if (that.history.length === 1) {
                        return;
                    }

                    that.history.pop();
                    url = that.history[that.history.length - 1];
                } else {
                    that.history.push(url);
                }

                that.historyCallback(url, kendo.parseQueryStringParams(url));
            };

            this._historyReplace = function(url) {
                var params = kendo.parseQueryStringParams(url);
                that.history[that.history.length - 1] = url;
                that.historyCallback(url, params);
            };

            that.loader = new Loader(element, {
                loading: that.options.loading
            });

            that.viewEngine = new ViewEngine({
                container: element,
                transition: options.transition,
                rootNeeded: !options.initial,
                serverNavigation: options.serverNavigation,
                remoteViewURLPrefix: options.root || "",
                layout: options.layout,
                loader: that.loader
            });

            that.viewEngine.bind("showStart", function() {
                that.loader.transition();
                that.closeActiveDialogs();
            });

            that.viewEngine.bind("after", function(e) {
                that.loader.transitionDone();
            });

            that.viewEngine.bind(VIEW_SHOW, function(e) {
                that.trigger(VIEW_SHOW, e);
            });

            that.viewEngine.bind("loadStart", function() {
                that.loader.show();
            });

            that.viewEngine.bind("loadComplete", function() {
                that.loader.hide();
            });

            that.viewEngine.bind(SAME_VIEW_REQUESTED, function() {
                that.trigger(SAME_VIEW_REQUESTED);
            });

            that.viewEngine.bind("viewTypeDetermined", function(e) {
                if (!e.remote || !that.options.serverNavigation)  {
                    that.trigger(NAVIGATE, { url: e.url });
                }
            });

            this._setPortraitWidth();

            kendo.onResize(function() {
                that._setPortraitWidth();
            });

            that._setupAppLinks();
        },

        closeActiveDialogs: function() {
            var dialogs = this.element.find(roleSelector("actionsheet popover modalview")).filter(":visible");
            dialogs.each(function() {
                kendo.widgetInstance($(this), ui).close();
            });
        },

        navigateToInitial: function() {
            var initial = this.options.initial;

            if (initial) {
                this.navigate(initial);
            }
        },

        options: {
            name: "Pane",
            portraitWidth: "",
            transition: "",
            layout: "",
            collapsible: false,
            initial: null,
            loading: "<h1>Loading...</h1>"
        },

        events: [
            NAVIGATE,
            VIEW_SHOW,
            SAME_VIEW_REQUESTED
        ],

        append: function(html) {
            return this.viewEngine.append(html);
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.viewEngine.destroy();
        },

        navigate: function(url, transition) {
            if (url instanceof View) {
                url = url.id;
            }

            this.transition = transition;

            this._historyNavigate(url);
        },

        replace: function(url, transition) {
            if (url instanceof View) {
                url = url.id;
            }

            this.transition = transition;

            this._historyReplace(url);
        },

        bindToRouter: function(router) {
            var that = this,
                options = that.options,
                initial = options.initial,
                viewEngine = this.viewEngine;

            router.bind("init", function(e) {
                var url = e.url,
                    attrUrl = router.pushState ? url : "/";

                viewEngine.rootView.attr(kendo.attr("url"), attrUrl);

                if (url === "/" && initial) {
                    router.navigate(initial, true);
                    e.preventDefault(); // prevents from executing routeMissing, by default
                }
            });

            router.bind("routeMissing", function(e) {
                if (!that.historyCallback(e.url, e.params)) {
                    e.preventDefault();
                }
            });

            router.bind("same", function() {
                that.trigger(SAME_VIEW_REQUESTED);
            });

            that._historyNavigate = function(url) {
                router.navigate(url);
            };

            that._historyReplace = function(url) {
                router.replace(url);
            };
        },

        hideLoading: function() {
            this.loader.hide();
        },

        showLoading: function() {
            this.loader.show();
        },

        changeLoadingMessage: function(message) {
            this.loader.changeMessage(message);
        },

        view: function() {
            return this.viewEngine.view();
        },

        _setPortraitWidth: function() {
            var width,
                portraitWidth = this.options.portraitWidth;

            if (portraitWidth) {
                width = kendo.mobile.application.element.is(".km-vertical") ? portraitWidth : "auto";
                this.element.css("width", width);
            }
        },

        _setupAppLinks: function() {
            this.element.handler(this)
                .on("down", roleSelector(linkRoles), "_mouseup")
                .on("up", roleSelector(buttonRoles), "_mouseup")
                .on("click", roleSelector(linkRoles + " " + buttonRoles), "_appLinkClick");
        },

        _appLinkClick: function (e) {
            var href = $(e.currentTarget).attr("href");
            var remote = href && href[0] !== "#" && this.options.serverNavigation;

            if(!remote && attrValue($(e.currentTarget), "rel") != EXTERNAL) {
                e.preventDefault();
            }
        },

        _mouseup: function(e) {
            if (e.which > 1 || e.isDefaultPrevented()) {
                return;
            }

            var pane = this,
                link = $(e.currentTarget),
                transition = attrValue(link, "transition"),
                rel = attrValue(link, "rel") || "",
                target = attrValue(link, "target"),
                href = link.attr(HREF),
                remote = href && href[0] !== "#" && this.options.serverNavigation;

            if (remote || rel === EXTERNAL || (typeof href === "undefined") || href === DUMMY_HREF) {
                return;
            }

            // Prevent iOS address bar progress display for in app navigation
            link.attr(HREF, DUMMY_HREF);
            setTimeout(function() { link.attr(HREF, href); });

            if (rel.match(WIDGET_RELS)) {
                kendo.widgetInstance($(href), ui).openFor(link);
                // if propagation is not stopped and actionsheet is opened from tabstrip,
                // the actionsheet is closed immediately.
                if (rel === "actionsheet" || rel === "drawer") {
                    e.stopPropagation();
                }
            } else {
                if (target === "_top") {
                    pane = mobile.application.pane;
                }
                else if (target) {
                    pane = $("#" + target).data("kendoMobilePane");
                }

                pane.navigate(href, transition);
            }

            e.preventDefault();
        }
    });

    Pane.wrap = function(element) {
        if (!element.is(roleSelector("view"))) {
            element = element.wrap('<div data-' + kendo.ns + 'role="view" data-stretch="true"></div>').parent();
        }

        var paneContainer = element.wrap('<div class="km-pane-wrapper"><div></div></div>').parent(),
            pane = new Pane(paneContainer);

        pane.navigate("");

        return pane;
    };
    ui.plugin(Pane);
})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });