/**
 * Created by Nil on 2/24/14.
 */

import ReminderCollectionView = require('./reminder-collection-view');
import ReminderItemView = require('../item/reminder-item-view');

class ReminderViewController extends Marionette.Controller{

    private _view : ReminderCollectionView;

    constructor(View){
        super();
        this._view = View;
    }

}

export =  ReminderViewController;