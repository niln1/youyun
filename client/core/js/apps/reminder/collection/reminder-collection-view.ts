/**
 * Created by Nil on 2/23/14.
 */

/// <reference path='../../../vendor/backbone/marionette.d.ts'/>

import BaseCollectionView = require('../../../config/base-collection-view');
import ReminderItemView = require('../item/reminder-item-view');
import ReminderListCollection = require('../../../models/reminder-list-collection');

class ReminderCollectionView extends BaseCollectionView {
    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.collection = new ReminderListCollection();
        this.itemView = ReminderItemView;
        this.listenTo(this.collection, "reset", this.render);
        this.collection.fetch({reset: true});
    }

    onBeforeRender(){
        console.log("Before: "+JSON.stringify(this.collection));
    }
}

export = ReminderCollectionView;