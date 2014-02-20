/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/user-profile-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');

class UserProfileView extends BaseItemView {

    public controller:any;

    constructor(context?:any, options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template = require('./templates/user-profile-view-tmpl');
    }
}

export = UserProfileView;