/**
 * Created by Nil on 2/23/14.
 */

/// <reference path="../../../vendor/require/require.d.ts"/>
/// <reference path="../../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/reminder-collection-view-tmpl" />

import BaseCollectionView = require('../../../config/base-collection-view');
import ReminderItemView = require('../item/reminder-item-view');

class ReminderCollectionView extends BaseCollectionView {
    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.collection = new Backbone.Collection([
            {message: "Hello World", timestamp: 1000},
            {message: "Hello pig", timestamp: 1000},
            {message: "Hello monkey", timestamp: 1000}
        ]);
//        this.template = require('./templates/reminder-collection-view-tmpl');
        this.itemView = ReminderItemView;
    }
//    appendHtml(collectionView, itemView){
//        collectionView.$("tbody").append(itemView.el);
//    }
}

export = ReminderCollectionView;