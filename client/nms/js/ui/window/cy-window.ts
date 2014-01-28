/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CyTemplates = require('../../util/cy-templates');
import CyWindowManager = require('./cy-window-manager');
/*
 * basic framed window.
 */
class CyWindow extends CyEvents.CyEventManager {

    /**
     * construct a new window
     */
        constructor(config?:ICyWindowConfiguration) {

        // chain constructor

        super();

        this.init(config);
    }

    private init(config?:ICyWindowConfiguration):void {
        // create an outer div that becomes the window and an inner div which is for the client content.
        // The outer div is appended to a visible area of the body reserved for windows in master.html

        this.outer = $('<div class="cy-window"></div>').appendTo($('body'));

        this.inner = $('<div class="cy-window-clientArea"></div>').appendTo(this.outer);

        // before initializing the window give the caller the chance to overload the default settings with
        // the optional values in config parameter

        var c:ICyWindowConfiguration = _.extend({

            minWidth: 200,
            minHeight: 50,
            maxWidth: 2048,
            maxHeight: 2048,
            modal: false,
            resizable: true,
            draggable: true,
            title: "Window",
            close: $.proxy(this.closeHandler, this),

            resize: $.proxy(function (e:any) {

                this.startIFrameFix();

                this.onWindowResized();

            }, this),

            dragstart: $.proxy(function () {

                this.startIFrameFix();

            }, this),

            dragend: $.proxy(function () {

                this.endIFrameFix();

            }, this)

        }, config);

        // add width and height only if specified

        if (config['width']) {
            c.width = config.width;
        }

        if (config['height']) {
            c.height = config.height;
        }

        // create the window and configure. Only supply width/height if present

        this.window = this.outer.kendoWindow(c);

        // from the kendo UI forums, this allows us to track the position of the window as it is dragged
        // http://www.kendoui.com/forums/kendo-ui-web/window/kendowindow-appendto-boundaries.aspx

        // (NOTE: The cast to any removes the compilation error about kendo.ui.window doesn't have a dragging property)

        if (c['draggable'] && c['draggable'] === true) {
            (<any>this.kWindow).dragging._draggable.bind('drag', () => {
                this.clamp();
            });
        }

        // if the browser window changes size we also need to clamp

        $(window).on('resize', this.clampProxy);

        // sink mouse up on window to ensure we get notified and can cancel the iframe fix

        $(window).mouseup($.proxy(function (e) {

            if (e.which === 1) {

                this.endIFrameFix();
            }

        }, this));

        // we must also sink the window lost focus event in case the system takes the focus without notifying
        // us about cancelled mouse captures

        $(window).blur($.proxy(function (e) {

            this.endIFrameFix();

        }, this));

        // add to window manager

        CyWindowManager.I.addWindow(this);
    }

    /**
     * true when dragging or resizing the window. We have to track this accurately to apply a fix for iframes that suck down the mouse events
     */
    private iframeFixActive:Boolean = false;

    /**
     * call when a drag starts or WHENEVER you detect a resize in progress
     */
    private startIFrameFix() {

        if (this.iframeFixActive === false) {

            this.iframeFixActive = true;

            // block iframes by placing an almost invisible div over each one.

            $('iframe').each(function () {


                $('<div class="cy-ui-draggable-iframeFix" style="background: #fff;"></div>')
                    .css({
                        width: this.offsetWidth + "px", height: this.offsetHeight + "px",
                        position: "absolute", opacity: "0.001", 'z-index': 1000
                    })
                    .css($(this).offset())
                    .appendTo("body");
            });

        }
    }

    /**
     * end the iframe fix
     */
    private endIFrameFix() {

        if (this.iframeFixActive) {

            this.iframeFixActive = false;

            // remove any divs that are blocking iframes

            $("div.cy-ui-draggable-iframeFix").each(function() {

                this.parentNode.removeChild(this);

            });
        }
    }

    /**
     * base class return generic information about the window, override in child classes
     * @returns {{displayName: string, windowType: string}}
     */
    public
    get
        info():ICyWindowInfo {

        return {
            displayName: "Generic Window Title",
            windowType: "Generic Window"
        }
    }

    /**
     * Pin the window to a desired location
     * @input location: location of the window (Choose from left, right, top, bottom, middle)
     * @input pos: [left, top, width, height]
     * @input margin: [top, right, bottom, left]
     */
    public
        pin(location:string, pos ?:string[], margin ?:string[]):void {
        var styles = null;

        if (location === 'left') {
            styles = { left: '0', top: '0', width: '50%', height: '100%' };
        } else if (location === 'right') {
            styles = { left: '50%', top: '0', width: '50%', height: '100%' };
        } else if (location === 'top') {
            styles = { left: '0', top: '0', width: '100%', height: '50%' };
        } else if (location === 'bottom') {
            styles = { left: '0', top: '50%', width: '100%', height: '50%' };
        } else {
            styles = { left: '25%', top: '25%', width: '50%', height: '50%' };
        }

        if (pos && pos.length == 4) {
            styles.left = pos[0];
            styles.top = pos[1];
            styles.width = pos[2];
            styles.height = pos[3];
        }

        if (margin && margin.length == 4) {
            styles.margin = margin.join(' ');
        } else {
            // kendo titlebar has padding of 33px
            styles.margin = "-33px 0 0 0";
        }

        this.kWindow.wrapper.css(styles);
        this.clamp();
    }

    /**
     * clamp the position of the window
     */
    private clamp():void {

        // get position of window

        var position = this.kWindow.wrapper.position();

        // clamp to app content area, this could be any element potentionally though

        var content:JQuery = CyTemplates.content;

        // get position and dimensions of app content area

        var cpos = content.offset();

        var cdim = {
            width: content.width(),
            height: content.height()
        }

        // limit to top/left edge of content area and also ensure that the top left corner of the window remains visible

        var left:number = Math.max(cpos.left, position.left);

        left = Math.min(cpos.left + cdim.width - CyWindow.kWINDOW_LIMIT, left);

        var top:number = Math.max(cpos.top, position.top);

        top = Math.min(cpos.top + cdim.height - CyWindow.kWINDOW_LIMIT, top);

        //var height = Math.min(winDim.height, cdim.height - titleHeight);

        //var width = Math.min(winDim.width, cdim.width);

        this.kWindow.wrapper.css({
            left: left,
            top: top
            //width: width,
            //height: height
        });
    }

    /**
     * windows must leave this number of pixels visible within the content area
     * @type {number}
     */
    private static kWINDOW_LIMIT:number = 100;

    /**
     * return the kendo window object we represent
     * @returns {kendo.ui.Window}
     */
    public get kWindow():kendo.ui.Window {
        return this.window.data("kendoWindow");
    }

    /**
     * when the window is resized, ensure we are clamped to the viewport and publish an event
     * @param e
     */
    private onWindowResized(e:any):void {

        this.clamp();

        this.trigger(CyWindow.kEVENT_RESIZED, {
            sender: this
        });
    }

    /**
     * event that is fired when the window is resized
     * @type {string}
     */
    public static kEVENT_RESIZED:string = "CyWindow-Event-Resized";

    /**
     * event that is fired when the window is closing
     * @type {string}
     */
    public static kEVENT_CLOSING:string = "CyWindow-Event-Closing";

    /**
     * outer and inner div that are the main components of the window structor
     */
    public outer:JQuery;

    public inner:JQuery;

    /**
     * the window JQuery selector
     */
    private window:JQuery;

    /**
     * return our inner div which is the window client area
     * @returns {JQuery}
     */
    public get clientArea():JQuery {
        return this.inner;
    }

    /**
     * center the window but also take care to clamp to working area
     */
    public center():void {

        this.window.data("kendoWindow").center();

        this.clamp();
    }

    /**
     * activate window, bring to front of stack
     */
    public activate():void {

        // restore in case minimized

        this.kWindow.restore();

        // front of stack

        this.kWindow.toFront();
    }


    /**
     * so we can unbind from this event cleanly
     */
    private clampProxy:any = () => {
        this.clamp();
    };

    /**
     * programmatic way to close the window, actual close handler is called in response to the close event from the window
     */
    public close():void {

        this.kWindow.close();
    }

    /**
     * close handler
     */
    private closeHandler() {

        // send closing event

        this.trigger(CyWindow.kEVENT_CLOSING, {
            sender: this
        });

        // remove from window manager

        CyWindowManager.I.removeWindow(this);

        // destroy kendo window

        this.kWindow.destroy();

        // unsink events

        $(window).off('resize', this.clampProxy);

    }
}

export = CyWindow