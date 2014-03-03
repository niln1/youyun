/**
 * Created by Nil on 2/19/14.
 */

import BaseViewLayout = require('./left-panel-view-layout');
import UserProfileView = require('../user-profile/user-profile-view');
import ReminderViewLayout = require('../reminder/reminder-view-layout');

class LeftPanelViewController extends Marionette.Controller {

    private _view : BaseViewLayout;

    constructor(View){
        super();
        this._view = View;
    }

    showUserProfile(){
        this._view.leftTopRegion.show(new UserProfileView());
    }

    showReminder(){
        var reminderViewLayout = new ReminderViewLayout();
        this._view.leftBottomRegion.show(reminderViewLayout);
        reminderViewLayout.controller.showCollectionView();
    }
}

export =  LeftPanelViewController;