/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/main-view-layout-tmpl" />

import MainViewController = require('./main-view-controller');

class MainViewLayout extends Marionette.Layout {
    public controller:MainViewController;

    //to remove the ws complain
    public leftPanel: any;
    public rightPanel: any;

    constructor() {
        super();
        this.template = require('./templates/main-view-layout-tmpl');
        this.addRegions({
            leftPanel : '#left-panel-content',
            rightPanel: '#right-panel-content'
        });
        this.controller = new MainViewController;
    }
}

export = MainViewLayout;