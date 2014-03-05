/**
 * Created by Nil on 2/11/14.
 */
/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>
/// <reference path='../../vendor/moment/moment.d.ts'/>

/// <amd-dependency path="./templates/feed-center-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');

class FeedCenterView extends BaseItemView {

    public timestampID : string = '#content-time-heading';

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/feed-center-view-tmpl');
    }

    public momentConfigFormat : string = 'LL, dddd';
    public momentConfigLang : string = 'zh-cn';


    public updateTime(): void {
        moment.lang(this.momentConfigLang);
        var time_element = moment().format(this.momentConfigFormat);
        $(this.timestampID).text(time_element);
    }

}

export = FeedCenterView;