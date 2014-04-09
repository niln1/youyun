/**
 * Created by Nil on 2/23/14.
 */

/// <reference path="../../../vendor/require/require.d.ts"/>
/// <reference path="../../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../../vendor/backbone/marionette.d.ts'/>
/// <reference path='../../../vendor/moment/moment.d.ts'/>

/// <amd-dependency path="./templates/reminder-item-view-tmpl" />

import BaseItemView = require('../../../config/base-item-view');
import ReminderModel = require('../../../models/reminder-model');
import DataManager = require('../../../data-manager');

class ReminderItemView extends BaseItemView {
    public momentConfigFormat : string = 'lll';
    public momentConfigLang : string = 'zh-cn';

    public model : ReminderModel;

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.events = {
          "click .toggle-reminder": "afterToggle",
          "click .remove-reminder": "afterRemove"
        };
        this.template = require('./templates/reminder-item-view-tmpl');
        this.model.id = this.model.get('_id');
        this.context.message = this.model.get('message');
        this.context.dueDate = this.getTimeString();
    }

    private getTimeString() {
        moment.lang(this.momentConfigLang);
        var timeString = this.model.get('dueDate');
        return timeString ? moment(timeString).calendar():"";
    }

    private afterToggle() {
        console.log("after Toggle");
        this.model.toggle();
    }

    private afterRemove() {
        console.log("after Remove");
        var onSuccess = function(){
            console.log("destroy successful");
            DataManager.I.getReminderListCollection().fetch({reset: true});
        };
        this.model.clear(onSuccess);
    }
}

export = ReminderItemView;