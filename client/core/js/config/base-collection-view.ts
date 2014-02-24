/**
 * Created by Nil on 2/23/14.
 */
/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class BaseCollectionView extends Marionette.CollectionView{

    public events:any;
    public template:any;
    public context:any;

    constructor(options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template =  {};
        this.context = {};
    }

    render():BaseCollectionView{
        this.setElement(this.template(this.context));
        return this.el;
    }
}

export = BaseCollectionView;
