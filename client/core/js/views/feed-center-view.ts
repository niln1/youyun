/**
 * Created by Nil on 2/11/14.
 */
/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>
/// <reference path='../vendor/moment/moment.d.ts'/>

/// <amd-dependency path="../templates/feed-center-view-tmpl" />


class FeedCenterView extends Backbone.View {

    public events:Object;
    private template:any;
    private context:any;

    private static timestampID : string = '#content-time-heading';
    private static momentConfigFormat : string = 'LL, dddd';
    private static momentConfigLang : string = 'zh-cn';

    constructor(context?:any, options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template = require('../templates/feed-center-view-tmpl');
        this.context = context || {};
    }

    public render(): Backbone.View {
        this.setElement(this.template(this.context));
        return this.el;
    }

    public updateTime(): void {
        moment.lang(FeedCenterView.momentConfigLang);
        var time_element = moment().format(FeedCenterView.momentConfigFormat);
        $(FeedCenterView.timestampID).text(time_element);
    }

}

export = FeedCenterView;