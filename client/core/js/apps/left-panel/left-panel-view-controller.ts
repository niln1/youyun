/**
 * Created by Nil on 2/19/14.
 */

import BaseViewLayout = require('./left-panel-view-layout');
import UserProfileView = require('../user-profile/user-profile-view');
import ReminderViewLayout = require('../reminder/reminder-view-layout');

class LeftPanelViewController {

    private _view : BaseViewLayout;

    constructor(View){
        this._view = View;
    }

    showUserProfile(){
        this._view.leftTopRegion.show(new UserProfileView());
    }

    showReminder(){
        this._view.leftBottomRegion.show(new ReminderViewLayout());
    }
}

export =  LeftPanelViewController;