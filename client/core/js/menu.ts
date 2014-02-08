
/// <reference path="vendor/require/require.d.ts"/>
/// <reference path="vendor/jquery/jquery.d.ts"/>
/// <amd-dependency path="templates/menu" />

class Menu {
    public static MAIN_MENU_SELECTOR : string = '.main-menu';
    public static MENU_BACKGROUND_SELECTOR : string = '#header-background';
    private menuContainer;
    private menuBackground;

    constructor () {
        // TODO JQuery selector
        var menuTemplate = require('templates/menu');
        if (menuTemplate && menuTemplate.template) {
            this.menuContainer = $(Menu.MAIN_MENU_SELECTOR);
            var menuTemplate = menuTemplate.template({});
            this.menuContainer.append(menuTemplate);
            this.menuBackground = $(Menu.MENU_BACKGROUND_SELECTOR);
            $('li.account a').click(function (_this : Menu) {
               return function (event) {
                   _this.menuBackground.toggleClass("closed");
                   event.preventDefault();
               }
            }(this));
        }
    }
}

export = Menu;