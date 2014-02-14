/// <reference path="../vendor/require/require.d.ts"/>
/// <reference path="../vendor/jquery/jquery.d.ts"/>
/// <reference path='../vendor/backbone/marionette.d.ts'/>

/// <amd-dependency path="../templates/split-view-layout-tmpl" />

class SplitViewLayout extends Marionette.Layout {

    private template: any;
    private regions: any;
    private context: any;

    //to remove the ws complain
    public leftPanel: any;
    public rightPanel: any;

    constructor(regions?: any, context?: any) {

        super();
        this.template = require('../templates/split-view-layout-tmpl');
        this.regions = regions || {};
        this.context = context || {};

        this.addRegions({
            leftPanel : '#left-panel-content',
            rightPanel: '#right-panel-content'
        });

    }


    render(): Marionette.Layout {

        this.$el.html(this.template(this.context));
        return this.el;

    }

}

export = SplitViewLayout;