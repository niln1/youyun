/**
 * Created by Nil on 2/17/14.
 */

import MainViewLayout = require('./main-view-layout');
import FeedCenterView = require('../feed-center/feed-center-view');
import LeftPanelViewLayout = require('../left-panel/left-panel-view-layout');

class MainViewController {

    private _view : MainViewLayout;

    constructor(View){
        this._view = View;
    }

    showFeedCenter(){
        this._view.rightPanelRegion.show(new FeedCenterView());
        this._view.rightPanelRegion.currentView.controller.updateTime();
    }

    showLeftPanel(){
        var leftPanelLayout = new LeftPanelViewLayout();
        this._view.leftPanelRegion.show(leftPanelLayout);
        leftPanelLayout.controller.showUserProfile();
        leftPanelLayout.controller.showReminder();
    }

}

export =  MainViewController;