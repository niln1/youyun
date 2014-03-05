/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>
/// <reference path='../../vendor/bootstrap/bootstrap.d.ts'/>
/// <reference path='../../vendor/bootstrap/bootstrap.datepicker.d.ts'/>

/// <amd-dependency path="./templates/reminder-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout');
import ReminderCollectionView = require('./collection/reminder-collection-view');

class ReminderViewLayout extends BaseLayout {

    public addNewReminderModalId: string = "#addReminderModal";
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

        $("#dateSelector").datepicker({
            language: 'zh-CN'
        });
    }

    public showCollectionView(){
        var reminderCollectionView = new ReminderCollectionView({tagName: "ol"});
        reminderCollectionView.render();
        this.reminderItemsRegion.show(reminderCollectionView);
    }

    public saveNewReminder(){
        //TODO if datepicker exist dont setup
        $("#dateSelector").datepicker({
            language: 'zh-CN'
        });
        console.log("saving new reminder");
        $(this.addNewReminderModalId).modal('hide');
    }
}

export = ReminderViewLayout;