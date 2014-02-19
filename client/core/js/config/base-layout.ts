/**
 * Created by Nil on 2/19/14.
 */
/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class BaseLayout extends Marionette.Layout{

    public events:any;
    public template:any;
    public context:any;

    constructor() {
        super();
        this.events = {};
        this.template = {};
        this.context = {};
    }

    render(): BaseLayout {
        this.$el.html(this.template(this.context));
        return this.el;
    }
}

export = BaseLayout;