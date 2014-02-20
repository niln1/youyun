/**
 * Created by Nil on 2/19/14.
 */

import BaseViewLayout = require('./left-panel-view-layout');

class LeftPanelViewController {

    private _view : BaseViewLayout;

    constructor(View){
        this._view = View;
    }
}

export =  LeftPanelViewController;