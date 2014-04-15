/**
 * Created by Nil on 2/12/14.
 */

import ReminderListCollection = require('./models/reminder-list-collection');
import AccountModel = require('./models/account-model');

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
            this.addResource("reminder-list-collection", new ReminderListCollection(), true);
        }
        return this.resources["reminder-list-collection"];
    }

    public getAccountModel():AccountModel {
        if(!this.resources["account-model"]){
            this.addResource("account-model", new AccountModel(), true);
        }
        return this.resources["account-model"];
    }

    public addResource(type:string, resource:any, fetch?:boolean):void {
        if(fetch){
            resource.fetch({reset: true});
        }
        this.resources[type] = resource;
    }
}
export = DataManager;