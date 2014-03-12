/**
 * Created by Nil on 3/11/14.
 */
/// <reference path='../vendor/backbone/marionette.d.ts'/>

import ReminderModel = require('./reminder-model');

class ReminderListCollection extends Backbone.Collection {

    constructor() {
        super(null, {model:ReminderModel});
    }

    public url() {
        return '/api/v1/reminders/read?signature=tempkey';
    }

    public parse(response) {
        console.log(response);
        return response.result;
    }
}

export = ReminderListCollection;