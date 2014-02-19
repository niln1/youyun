/**
 * Created by Nil on 2/11/14.
 */
/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/header-background-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');
import HeaderBackgroundViewController = require('./header-background-view-controller');

class HeaderBackgroundView extends BaseItemView {

    public controller:HeaderBackgroundViewController;

    constructor(context?:any, options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/header-background-view-tmpl');
        this.controller = new HeaderBackgroundViewController(this);
    }

}
export = HeaderBackgroundView;