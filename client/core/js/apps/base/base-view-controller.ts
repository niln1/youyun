/**
 * Created by Nil on 2/17/14.
 */

import BaseViewLayout = require('./base-view-layout');
import HeaderView = require('../header/header-view');
import HeaderBackgroundView = require('../header-background/header-background-view');
import MainViewLayout = require('../main/main-view-layout');

class BaseViewController {

    private _view : BaseViewLayout;

    constructor(View){
        this._view = View;
    }

    public showHeaderView(){
        this._view.headerRegion.show(new HeaderView());
    }
    public showHeaderBackgroundView(){
        this._view.headerBackgroundRegion.show(new HeaderBackgroundView());
        this._view.headerBackgroundRegion.currentView.controller.collapse();
    }
    public showMainViewLayout(){
        this._view.mainRegion.show(new MainViewLayout());
        this._view.mainRegion.currentView.controller.showFeedCenter();
        this._view.mainRegion.currentView.controller.showLeftPanel();
    }

}

export =  BaseViewController;