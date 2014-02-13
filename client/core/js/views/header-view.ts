/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="../templates/header-view-tmpl" />


class HeaderView extends Backbone.View {

    public events:Object;
    private template:any;
    private context:any;

    constructor(context?:any, options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template = require('../templates/header-view-tmpl');
        this.context = context || {};
    }

    public render(): Backbone.View {
        this.setElement(this.template(this.context));
        return this.el;
    }
}

export = HeaderView;