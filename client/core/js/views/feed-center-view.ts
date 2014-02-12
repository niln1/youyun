/**
 * Created by Nil on 2/11/14.
 */
/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="../templates/feed-center-view-tmpl" />


class FeedCenterView extends Backbone.View {

    public events:Object;
    private template:any;
    private context:any;

    constructor(context?:any, options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template = require('../templates/feed-center-view-tmpl');
        this.context = context || {};
    }

    render(): Backbone.View {
        this.setElement(this.template(this.context));
        return this.el;
    }

}

export = HeaderBackgroundView;