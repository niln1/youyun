/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/header-view-tmpl" />

import BaseItemView = require('../../config/base-item-view');
import HeaderModel = require('../../models/header-model');

class HeaderView extends BaseItemView {

    public model:HeaderModel;

    constructor(options?:Backbone.ViewOptions) {
        super(options);
        this.model = new HeaderModel();
        this.template = require('./templates/header-view-tmpl');
        this.context=this.model.data;
    }
}

export = HeaderView;