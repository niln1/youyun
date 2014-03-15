/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/base-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout')
import BaseViewController = require('./base-view-controller');

class BaseViewLayout extends BaseLayout {

    public controller:BaseViewController;

    //to remove the ws complain
    public headerRegion: any;
    public headerBackgroundRegion: any;
    public mainRegion: any;

    constructor() {
        super();
        this.template = require('./templates/base-view-layout-tmpl');
        this.addRegions({
            headerRegion : '#header-region',
            headerBackgroundRegion: '#header-background-region',
            mainRegion:'#main-region'
        });
        this.controller = new BaseViewController(this);
    }

}

export = BaseViewLayout;