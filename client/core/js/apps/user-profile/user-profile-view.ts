/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/user-profile-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');
import AccountModel = require('../../models/account-model');
import DataManager = require('../../data-manager');

class UserProfileView extends BaseItemView {

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.template = require('./templates/user-profile-view-tmpl');
        this.model = DataManager.I.getAccountModel();
//        this.context = new UserModel().data;
    }
}

export = UserProfileView;