/**
 * Created by Nil on 2/11/14.
 */
/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/feed-center-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');
import FeedCenterViewController = require('./feed-center-view-controller');

class FeedCenterView extends BaseItemView {

    public controller : FeedCenterViewController;

    public timestampID : string = '#content-time-heading';

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/feed-center-view-tmpl');
        this.controller = new FeedCenterViewController(this);
    }

}

export = FeedCenterView;