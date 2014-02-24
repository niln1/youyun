/**
 * Created by Nil on 2/23/14.
 */

/// <reference path="../../../vendor/require/require.d.ts"/>
/// <reference path="../../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/reminder-collection-view-tmpl" />

import BaseCollectionView = require('../../../config/base-collection-view');

class ReminderCollectionView extends BaseCollectionView {

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/reminder-collection-view-tmpl');
    }
}

export = ReminderCollectionView;