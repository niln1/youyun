/**
 * Created by Nil on 2/17/14.
 */

import BaseViewLayout = require('./base-view-layout');
import HeaderView = require('../header/header-view');
import HeaderBackgroundView = require('../header-background/header-background-view');
import MainViewLayout = require('../main/main-view-layout');

class BaseViewController extends Marionette.Controller {

    private _view : BaseViewLayout;

    constructor(View){
        super();
        this._view = View;
    }

    public showHeaderView(){
        this._view.headerRegion.show(new HeaderView());
    }
    public showHeaderBackgroundView(){
        var headerBackgroundView = new HeaderBackgroundView();
        this._view.headerBackgroundRegion.show(headerBackgroundView);
        headerBackgroundView.controller.collapse();
    }
    public showMainViewLayout(){
        var mainViewLayout = new MainViewLayout();
        this._view.mainRegion.show(mainViewLayout);
        mainViewLayout.showFeedCenter();
        mainViewLayout.showLeftPanel();
    }

}

export =  BaseViewController;