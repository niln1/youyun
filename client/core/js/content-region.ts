
/// <reference path='vendor/backbone/marionette.d.ts'/>

class ContentRegion extends Marionette.Region {
    private noRemove:boolean = false;
    private fade:boolean = false;

    constructor() {
        super({el: "#page-content"});
    }

    show(view:Backbone.View, noRemove:boolean = false, fade:boolean = false) : void {
        this.noRemove = noRemove;
        this.fade = fade;
        super.show(view);
    }

    open(view: Backbone.View): void {
        if ( !this.noRemove ) {
            super.open(view);
        } else {
            if ( this.fade )
                $(view.el).hide();
            this.$el.append(view.el);
            if ( this.fade )
                $(view.el).fadeIn(1500);
        }
    }

    close() : void {
        if ( !this.fade ) {
            super.close();
        } else {
            var view = <Marionette.View>this.currentView;
            if (!view || view.isClosed){ return; }

            view.$el.fadeOut(1500, function() {
                view.$el.remove();
            });

            delete this.currentView;
        }
    }
}

export = ContentRegion;