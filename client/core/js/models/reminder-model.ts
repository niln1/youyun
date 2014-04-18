/**
 * Created by Nil on 3/11/14.
 */
/// <reference path='../vendor/backbone/marionette.d.ts'/>
//import DataManager = require('../data-manager');

class ReminderModel extends Backbone.Model {
    constructor(attrs, options?) {
        super(attrs, options);
        this.urlRoot = 'api/v1/reminders';
        this.idAttribute = "_id";
    }

    defaults() {
        return {
            message: '',
            dueDate: new Date(),
            isDone: false
        }
    }

    toggle() {
        this.save({ isDone: !this.get('isDone'), signature: "tempkey" },{ patch : true });
    }

    clear(onSuccess?) {
        //TODO: this is a hack
        this.url = this.urlRoot+"/"+this.attributes[this.idAttribute]+"?signature=tempkey";
        this.destroy({
            success:onSuccess
        });
    }
}

export = ReminderModel;