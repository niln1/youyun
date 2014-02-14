/**
 * Created by Nil on 2/12/14.
 */
class DataManager {

    private resources:{[index:string]:Backbone.Collection};

    constructor() {

        this.resources = {};

    }

    public addResource(type:string, resourceCollection:Backbone.Collection, fetch?:boolean):void {
        if(fetch){
            resourceCollection.fetch({reset: true});
        }
        this.resources[type] = resourceCollection;
    }

}
export = DataManager;