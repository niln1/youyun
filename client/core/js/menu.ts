
/// <reference path="vendor/require/require.d.ts"/>
/// <amd-dependency path="templates/menu" />

class Menu {
    constructor () {
        // TODO JQuery selector
        var menuTemplate = require('templates/menu');
        console.log('Here');
    }

    public showMenu() {

    }

    public hideMenu() {

    }
}

export = Menu;