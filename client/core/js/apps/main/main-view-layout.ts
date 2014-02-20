/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/main-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout')
import MainViewController = require('./main-view-controller');

class MainViewLayout extends BaseLayout {
    public controller:MainViewController;

    //to remove the ws complain
    public leftPanelRegion: any;
    public rightPanelRegion: any;

    constructor() {
        super();
        this.template = require('./templates/main-view-layout-tmpl');
        this.addRegions({
            leftPanelRegion : '#left-panel-region',
            rightPanelRegion: '#right-panel-region'
        });
        this.controller = new MainViewController(this);
    }
}

export = MainViewLayout;