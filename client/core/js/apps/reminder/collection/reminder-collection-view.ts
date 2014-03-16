/**
 * Created by Nil on 2/23/14.
 */

/// <reference path='../../../vendor/backbone/marionette.d.ts'/>

import BaseCollectionView = require('../../../config/base-collection-view');
import ReminderItemView = require('../item/reminder-item-view');
import ReminderListCollection = require('../../../models/reminder-list-collection');
import MsgBus = require('../../../message-bus');

class ReminderCollectionView extends BaseCollectionView {
    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.collection = new ReminderListCollection();
        this.itemView = ReminderItemView;
        this.listenTo(this.collection, "reset", this.render);
        MsgBus.I.command.setHandler("reminders:rerender", $.proxy(this.refreshCollectionData, this));
        this.refreshCollectionData();
    }

    onBeforeRender(){
        console.log("Before: "+JSON.stringify(this.collection));
    }

    refreshCollectionData(){
        this.collection.fetch({reset: true});
    }
}

export = ReminderCollectionView;