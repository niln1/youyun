/**
 * Created by Nil on 2/19/14.
 */
/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/left-panel-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout')
import UserProfileView = require('../user-profile/user-profile-view');
import ReminderViewLayout = require('../reminder/reminder-view-layout');

class LeftPanelViewLayout extends BaseLayout {

    //to remove the ws complain
    public leftTopRegion: any;
    public leftBottomRegion: any;

    constructor() {
        super();
        this.template = require('./templates/left-panel-view-layout-tmpl');
        this.addRegions({
            leftTopRegion : '#left-top-region',
            leftBottomRegion: '#left-bottom-region'
        });
    }

    showUserProfile(){
        this.leftTopRegion.show(new UserProfileView());
    }

    showReminder(){
        var reminderViewLayout = new ReminderViewLayout();
        this.leftBottomRegion.show(reminderViewLayout);
        reminderViewLayout.initDateTimePicker();
        reminderViewLayout.showCollectionView();
    }

}

export = LeftPanelViewLayout;