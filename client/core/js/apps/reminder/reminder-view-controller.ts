/**
 * Created by Nil on 2/23/14.
 */

import ReminderViewLayout = require('./reminder-view-layout');
import ReminderCollectionView = require('./collection/reminder-collection-view');

class ReminderViewController extends Marionette.Controller{

    private _view : ReminderViewLayout;

    constructor(View){
        super();
        this._view = View;
    }

    public showCollectionView(){
        var reminderCollectionView = new ReminderCollectionView({tagName: "ol"});
        console.log(reminderCollectionView.el);
        reminderCollectionView.render();
        console.log(reminderCollectionView.el);
        this._view.reminderItemsRegion.show(reminderCollectionView);
    }
}

export =  ReminderViewController;