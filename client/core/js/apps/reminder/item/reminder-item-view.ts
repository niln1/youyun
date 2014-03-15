/**
 * Created by Nil on 2/23/14.
 */

/// <reference path="../../../vendor/require/require.d.ts"/>
/// <reference path="../../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/reminder-item-view-tmpl" />

import BaseItemView = require('../../../config/base-item-view');

class ReminderItemView extends BaseItemView {

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/reminder-item-view-tmpl');
        this.context = this.model.attributes;
    }
}

export = ReminderItemView;