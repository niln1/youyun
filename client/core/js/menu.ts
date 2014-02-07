
/// <reference path="vendor/require/require.d.ts"/>
/// <amd-dependency path="templates/menu" />

class Menu {
    public static MAIN_MENU_SELECTOR : string = '.main-menu';

    constructor () {
        // TODO JQuery selector
        var menuTemplate = require('templates/menu');
        if (menuTemplate && menuTemplate.template) {
            var menuContainer = $(Menu.MAIN_MENU_SELECTOR);
            var menuTemplate = menuTemplate.template({});
            menuContainer.append(menuTemplate);
        }
    }

    public showMenu() {

    }

    public hideMenu() {

    }
}

export = Menu;