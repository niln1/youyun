/// <reference path="../../vendor/require/require.d.ts"/>
/// <reference path="../../vendor/jquery/jquery.d.ts"/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="./templates/user-profile-view-tmpl" />


class UserProfileView extends Marionette.ItemView {

    public events:Object;
    private template:any;
    private context:any;

    constructor(context?:any, options?:Backbone.ViewOptions) {
        super(options);

        this.events = {};
        this.template = require('./templates/user-profile-view-tmpl');
        this.context = context || {};
    }

    public onRender(): Marionette.ItemView {
        this.setElement(this.template(this.context));
        return this.el;
    }
}

export = UserProfileView;