/**
 * Created by Nil on 2/23/14.
 */

/// <reference path="../../../vendor/require/require.d.ts"/>
/// <reference path="../../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../../vendor/backbone/marionette.d.ts'/>
/// <reference path='../../../vendor/moment/moment.d.ts'/>

/// <amd-dependency path="./templates/reminder-item-view-tmpl" />

import BaseItemView = require('../../../config/base-item-view');

class ReminderItemView extends BaseItemView {
    public momentConfigFormat : string = 'lll';
    public momentConfigLang : string = 'zh-cn';

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/reminder-item-view-tmpl');
        this.context.message = this.model.get('message');
        this.context.dueDate = this.getTimeString();
    }

    private getTimeString() {
        moment.lang(this.momentConfigLang);
        var timeString = this.model.get('dueDate');
        return timeString ? moment(timeString).calendar():"";
    }

}

export = ReminderItemView;