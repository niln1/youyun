/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyWidget = require("./cy-widget");
import CyTemplates = require("../../util/cy-templates");
import CyModel = require("../../data/models/cy-model");
import CyMessage = require("../../cy-message");

class CyUserMenu extends CyWidget {

    constructor(userData:any) {

        super("CyUserMenu");

        this.userModel = new CyModel(userData);

        _.bindAll(this, "toggleMenu", "hidePanel", "itemSelected");
    }

    public buildElement() : JQuery {

        var container = $('<div></div>');

        // clone user menu template
        var template:JQuery = $(CyTemplates.compileTemplate('master-page-user-menu')(this.userModel.data[0]));

        // append to div wrapper so $.find will work for the top level elements
        template.appendTo(container);

        this.menu = $('.cyan-user-menu', container);

        this.panel = this.menu.find('ul.menu-panel');

        // handle click on menu container
        this.menu.click(this.toggleMenu);


        // handle click on menu items
        $('.menu-panel li', this.menu).click(this.itemSelected);

        return template;

    }

    /**
     * Passes the menu item selected event down the event system
     * @param e
     */
    private itemSelected(e:JQueryEventObject) {
        this.trigger(CyMessage.kUSER_MENU_ITEM_SELECTED, {
            sender: this,
            item: e.target
        });

        this.hidePanel(e, true);

        e.stopPropagation();
    }

    /**
     * Toggles the menu state on or off
     * @param e
     */
    private toggleMenu(e:JQueryEventObject) {

        // remove panel if user menu link is already active
        if (this.menu.is('.menu-active')) {
            this.hidePanel(e);
        } else {
            // menu should be active during the entire time the panel is shown
            this.menu.addClass('menu-active');

            // show the panel
            this.panel.fadeIn('fast');

            // hide the panel when click anywhere outside of the panel
            $('body').unbind('click', this.hidePanel).click(this.hidePanel);
        }

        // prevent the click from bubbling up and calling removePanel for this exact event or the panel
        // will never get shown
        e.stopPropagation();
    }

    /**
     * used to hide the panel when clicked outside of it
     * @params e click event object
     * @params force close panel anyways ignoring where it was clicked
     */
    private hidePanel(e:any, force:boolean = false) {
        var target = e.target;

        // if target of the click isn't the panel or a descendant of the panel
        if (force || !this.panel.is(target) && this.panel.has(target).length === 0) {
            this.menu.removeClass('menu-active');
            this.panel.fadeOut('fast');
        }
    }

    /**
     * user data
     */
    private userModel:CyModel;

    /**
     * menu panel
     */
    private panel:JQuery;

    /**
     * menu container
     */
    private menu:JQuery;
}

export = CyUserMenu;