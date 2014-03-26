/**
 * Created by Nil on 2/23/14.
 */

/// <reference path='../../../vendor/backbone/marionette.d.ts'/>

import BaseCollectionView = require('../../../config/base-collection-view');
import ReminderItemView = require('../item/reminder-item-view');
import ReminderListCollection = require('../../../models/reminder-list-collection');
import MsgBus = require('../../../message-bus');
import DataManager = require('../../../data-manager');

class ReminderCollectionView extends BaseCollectionView {
    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.collection = DataManager.I.getReminderListCollection().dueToday().notDone();
        this.itemView = ReminderItemView;
        this.listenTo(DataManager.I.getReminderListCollection(), "reset", this.render);
    }

    onBeforeRender(){
        this.collection = DataManager.I.getReminderListCollection().dueToday().notDone();
        console.log("Before: "+JSON.stringify(this.collection));
    }
}

export = ReminderCollectionView;