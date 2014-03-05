/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/reminder-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout');
import ReminderCollectionView = require('./collection/reminder-collection-view');

class ReminderViewLayout extends BaseLayout {

    //to remove the ws complain
    public reminderItemsRegion: any;

    constructor() {
        super();
        this.events = {
            "click #saveNewReminder": "saveNewReminder"
        };
        this.template = require('./templates/reminder-view-layout-tmpl');
        this.addRegions({
            reminderItemsRegion : '#reminder-items-region'
        });
    }

    public showCollectionView(){
        var reminderCollectionView = new ReminderCollectionView({tagName: "ol"});
        reminderCollectionView.render();
        this.reminderItemsRegion.show(reminderCollectionView);
    }

    public saveNewReminder(){
        console.log("saving new reminder");
    }
}

export = ReminderViewLayout;