/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/user-profile-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');
import UserModel = require('../../models/user-model');

class UserProfileView extends BaseItemView {

    public controller:any;

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/user-profile-view-tmpl');
        this.context = new UserModel().data;
    }
}

export = UserProfileView;