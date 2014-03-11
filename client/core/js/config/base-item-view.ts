/**
 * Created by Nil on 2/19/14.
 */
/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class BaseItemView extends Marionette.ItemView{

    public events:any;
    public template:any;
    public context:any;

    constructor(options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template =  {};
        this.context = {};
    }

    render():BaseItemView{
        this.setElement(this.template(this.context));
        return this.el;
    }
}

export = BaseItemView;
