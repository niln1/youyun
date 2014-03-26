/**
 * Created by Nil on 2/12/14.
 */

import ReminderListCollection = require('./models/reminder-list-collection');

class DataManager {
    /**
     * singleton instance for the msgBus class. Access via the I() public/static method
     *
     * @method I
     * @return msgBus A singleton instance of the message bus.
     */
    public static instance:DataManager;

    public static get I():DataManager {
        if (!DataManager.instance) DataManager.instance = new DataManager();
        return DataManager.instance;
    }

    public static set I(I:DataManager) {
        DataManager.instance = I;
    }

    private resources:{[index:string] : any};

    constructor() {
        this.resources = {};
    }

    public getReminderListCollection():ReminderListCollection {
        if(!this.resources["reminder-list-collection"]){
            this.addResourceCollection("reminder-list-collection", new ReminderListCollection, true);
        }
        return this.resources["reminder-list-collection"];
    }

    public addResourceCollection(type:string, resourceCollection:Backbone.Collection, fetch?:boolean):void {
        if(fetch){
            resourceCollection.fetch({reset: true});
        }
        this.resources[type] = resourceCollection;
    }

}
export = DataManager;