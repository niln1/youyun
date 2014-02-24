/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/reminder-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout');
import ReminderViewController = require('./reminder-view-controller');

class ReminderViewLayout extends BaseLayout {

    public controller:ReminderViewController;

    //to remove the ws complain
    public reminderItemsRegion: any;

    constructor() {
        super();
        this.template = require('./templates/reminder-view-layout-tmpl');
        this.addRegions({
            reminderItemsRegion : '#reminder-items-region'
        });
        this.controller = new ReminderViewController(this);
    }
}

export = ReminderViewLayout;