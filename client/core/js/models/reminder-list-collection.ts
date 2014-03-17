/**
 * Created by Nil on 3/11/14.
 */
/// <reference path='../vendor/backbone/marionette.d.ts'/>

import ReminderModel = require('./reminder-model');

class ReminderListCollection extends Backbone.Collection {

    constructor() {
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
}

export = ReminderListCollection;