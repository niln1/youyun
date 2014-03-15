/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.timepicker.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>
/// <reference path='../../vendor/bootstrap/bootstrap.d.ts'/>
/// <reference path='../../vendor/bootstrap/bootstrap.datepicker.d.ts'/>
/// <reference path='../../vendor/moment/moment.d.ts'/>

/// <amd-dependency path="./templates/reminder-view-layout-tmpl" />

import BaseLayout = require('../../config/base-layout');
import ReminderCollectionView = require('./collection/reminder-collection-view');
import ReminderModel = require('../../models/reminder-model');

class ReminderViewLayout extends BaseLayout {

    public addNewReminderModalId: string = "#addReminderModal";
    public newReminderMessage: string = "#newReminderMessage";
    public newReminderDate: string = "#newReminderDatePicker";
    public newReminderTime: string = "#newReminderTimePicker";
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

    public initDateTimePicker(){
        var datePickerOptions = {language: "zh-CN", todayHighlight: true, autoclose: true};
        $(this.newReminderDate).datepicker(datePickerOptions);
        $(this.newReminderTime).timepicker();
    }

    public saveNewReminder(){
        console.log("saving new reminder");
        //TODO: add 保存中
        var message = $(this.newReminderMessage).val();
        var date = $(this.newReminderDate).val();
        var time = $(this.newReminderTime).val();

        var dueDate = moment(date + " " + time, "YYYY年MM月DD日 hh:mma");

        console.log(dueDate);

        var newReminder = new ReminderModel({message:message,dueDate:dueDate,signature:"tempkey"});
        newReminder.save();

        $(this.newReminderMessage).val("");
        $(this.newReminderDate).val("");
        $(this.newReminderTime).val("");

        $(this.addNewReminderModalId).modal('hide');
    }
}

export = ReminderViewLayout;