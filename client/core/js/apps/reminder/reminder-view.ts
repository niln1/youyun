/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/reminder-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');

class ReminderView extends BaseItemView {

    constructor(options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template = require('./templates/reminder-view-tmpl');
    }

}

export = ReminderView;