


class SplitViewLayout extends Marionette.Layout {

    private template: any;
    private regions: any;
    private context: any;

    constructor(template, regions?: any, context?: any) {

        super();
        this.template = template;
        this.regions = regions || {};
        this.context = context || {};

        this.regions =  {
            left_panel : '#left-panel',
            right_panel: '#right-panel'
        };

    }


    render(): Marionette.Layout {

        this.$el.html(this.template(this.context));
        return this.el;

    }

}

export = SplitViewLayout;