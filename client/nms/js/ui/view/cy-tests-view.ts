/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyApp = require('../../cy-app');
import CyView = require('./cy-view');
import CyWidget = require('../component/cy-widget');
import CyAnalytics = require('../../cy-analytics');
import CyTemplates = require('../../util/cy-templates');
import CyTimeline = require('../component/cy-timeline');

/**
 * this is view within the app class. It has nothing to do with the model-view paradigm
 */
class CyTestsView extends CyView {

    /**
     * constructor takes an optional redirect URL. This will be navigated to after a successful login, otherwise
     * it will navigate to the homepage
     *
     * @param redirect
     */
        constructor(private redirect?:string) {

        // super first as required, indicating we don't want user verification in this case

        super("CyTestsView");

        // hide navigation headers for this view

        CyApp.I.showNavigationHeaders();

        // sink browser resize

        CyApp.I.eventBus.on(CyApp.kBROWSER_RESIZED, $.proxy(this.onResize, this));

    }

    /**
     * initialize the view
     */

    private toggleStrong:boolean = true;
    private toggleMedium:boolean = true;
    private toggleWeak:boolean = true;
    private toggleWarning:boolean = true;

    public buildElement():JQuery {

        this.c = $('<div style="overflow-y:scroll"></div>');

        // shows how to hide certain classes

        $("<button>Toggle Critical</button>").click(() => {

            _.each(this.timelines, (t:CyTimeline) => {

                if (this.toggleStrong) {
                    t.hideClass('alarm-bar-critical');
                } else {
                    t.showClass('alarm-bar-critical');
                }
            });

            this.toggleStrong = !this.toggleStrong;

        }).appendTo(this.c);

        // ----------------

        $("<button>Toggle Major</button>").click(() => {

            _.each(this.timelines, (t:CyTimeline) => {

                if (this.toggleMedium) {
                    t.hideClass('alarm-bar-major');
                } else {
                    t.showClass('alarm-bar-major');
                }

            });

            this.toggleMedium = !this.toggleMedium;

        }).appendTo(this.c);

        // --------------------

        $("<button>Toggle Minor</button>").click(() => {

            _.each(this.timelines, (t:CyTimeline) => {

                if (this.toggleWeak) {
                    t.hideClass('alarm-bar-minor');
                } else {
                    t.showClass('alarm-bar-minor');
                }

            });

            this.toggleWeak = !this.toggleWeak;

        }).appendTo(this.c);

        // --------------------------------------

        $("<button>Toggle Warning</button>").click(() => {

            _.each(this.timelines, (t:CyTimeline) => {

                if (this.toggleWarning) {
                    t.hideClass('alarm-bar-warning');
                } else {
                    t.showClass('alarm-bar-warning')
                }

            });

            this.toggleWarning = !this.toggleWarning;

        }).appendTo(this.c);


        this.c.css({
            height: CyTemplates.content.height()
        });

        for (var i = 0; i < 5; i += 1) {

            var t:CyTimeline = new CyTimeline(null);

            t.element.appendTo(this.c);

            t.element.css({'margin-bottom': '1em'});

            this.timelines.push(t);
        }

        return this.c;
    }

    /**
     * when the browser is resized
     * @param e
     */
    private onResize(e?:any):void {

        this.c.css({
            height: CyTemplates.content.height()
        });

        _.each(this.timelines, (t:CyTimeline) => {

            t.resize();

        });

    }

    /**
     * timeline widget
     */
    private timelines:CyTimeline[] = [];

    private c:JQuery;

    /**
     * dispose the view, clean up, remove event handlers etc etc
     */
    public dispose():void {

        super.dispose();

    }
}

export = CyTestsView

