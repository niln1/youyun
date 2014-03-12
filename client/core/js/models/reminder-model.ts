/**
 * Created by Nil on 3/11/14.
 */
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class ReminderModel extends Backbone.Model {
    constructor(attrs, options) {
        this.urlRoot = 'api/v1/reminders';
        super(attrs, options);
    }
}

export = ReminderModel;