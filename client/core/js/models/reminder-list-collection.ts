/**
 * Created by Nil on 3/11/14.
 */
/// <reference path='../vendor/backbone/marionette.d.ts'/>
/// <reference path='../vendor/moment/moment.d.ts'/>


import ReminderModel = require('./reminder-model');

class ReminderListCollection extends Backbone.Collection {

    constructor(models?: any, options?: any) {
        this.url = '/api/v1/reminders?signature=tempkey';
        super(null, {model:ReminderModel});
    }

    public parse(response) {
        console.log(response);
        return response.result;
    }

    public comparator(model) {
        return model.get('dueDate');
    }

    public dueToday(){
        var filteredReminderItems = this.filter(function(reminder){
            var dueDate = reminder.get("dueDate");
            return moment(dueDate).diff(moment(),'days')===0;
        });

        return new ReminderListCollection(filteredReminderItems);
    }
}

export = ReminderListCollection;