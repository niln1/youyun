/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/main-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout');
import FeedCenterView = require('../feed-center/feed-center-view');
import LeftPanelViewLayout = require('../left-panel/left-panel-view-layout');

class MainViewLayout extends BaseLayout {

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
    }

    showFeedCenter(){
        var feedCenterView = new FeedCenterView();
        this.rightPanelRegion.show(feedCenterView);
        feedCenterView.updateTime();
    }

    showLeftPanel(){
        var leftPanelLayout = new LeftPanelViewLayout();
        this.leftPanelRegion.show(leftPanelLayout);
        leftPanelLayout.showUserProfile();
        leftPanelLayout.showReminder();
    }
}

export = MainViewLayout;