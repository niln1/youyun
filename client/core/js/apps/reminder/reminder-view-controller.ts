/**
 * Created by Nil on 2/23/14.
 */

import ReminderViewLayout = require('./reminder-view-layout');
import ReminderCollectionView = require('./collection/reminder-collection-view');

class ReminderViewController {

    private _view : ReminderViewLayout;

    constructor(View){
        this._view = View;
    }

}

export =  ReminderViewController;