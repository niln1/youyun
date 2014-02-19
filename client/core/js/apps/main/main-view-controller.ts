/**
 * Created by Nil on 2/17/14.
 */

import MainViewLayout = require('./main-view-layout');
import FeedCenterView = require('../feed-center/feed-center-view');

class MainViewController {

    private _view : MainViewLayout;

    constructor(View){
        this._view = View;
    }

    showFeedCenter(){
        this._view.rightPanel.show(new FeedCenterView());
    }

}

export =  MainViewController;