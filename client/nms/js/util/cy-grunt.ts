/// <reference path=".././definitions/jquery.d.ts" />
/// <reference path=".././definitions/underscore.d.ts" />
/// <reference path=".././definitions/kendo.web.d.ts" />

import CyTemplates = require("./cy-templates");

/**
 * class for displaying and managing short messages in a fix position list at top left of the viewport
 */
class CyGrunt {

    constructor(public message:string) {

        this.count = 0;

        this.isMaster = false;
    }

    /**
     * flash the background color to highlight
     */
    public flash():void {

        if (!this.timer) {

            this.element.addClass("grunt-nudge");

            this.timer = setTimeout(() => {

                this.element.removeClass("grunt-nudge");

                this.timer = null;

            }, 2000);
        }

    }

    public unflash():void {
        clearTimeout(this.timer);
    }

    private count:number;
    private timer:number;
    private element:JQuery;
    public isMaster:boolean;

    /**
     * construct and display a new grunt
     * @param message
     * @param color
     */
    public static showGrunt(message:string, color:number) {


        // if this is the first grunt then add the close all grunts grunt

        if (CyGrunt.addingRemoveAll === false && _.keys(CyGrunt.grunts).length === 0) {

            // flag this action so we don't get stuck in a recursive loop

            CyGrunt.addingRemoveAll = true;

            CyGrunt.showGrunt("Remove all notifications.", CyGrunt.kBLUE);

            CyGrunt.addingRemoveAll = false;
        }

        // find an existing grunt with this message if possible

        var g:CyGrunt = CyGrunt.grunts[message];

        // create if this is new

        if (!g) {

            g = new CyGrunt(message);

            CyGrunt.grunts[message] = g;

            if (CyGrunt.addingRemoveAll) {
                g.isMaster = true;
            }
        }

        g.count += 1;

        // if there is no element associated with this grunt we have to create one

        if (!g.element) {

            // create

            g.element = CyTemplates.cloneTemplate('grunt-template');

            // add correct color class

            g.element.addClass(CyGrunt.colorClasses[color]);

            // set the message text

            $('[data-element="grunt-text"]', g.element).html(message);

            // sink event on close button

            $('[data-element="grunt-close"]', g.element).click(CyGrunt.gruntClosed);

            // save the message with the close button for easy retrival when clicked

            $('[data-element="grunt-close"]', g.element).data("message", message);

            // inject into DOM

            g.element.appendTo(CyGrunt.gruntContainer);

        } else {

            // flash existing grunt

            g.flash();
        }

        // update count

        $('[data-element="grunt-count"]', g.element).text(g.count + ".");

    }


    /**
     * return the container for grunts...created on first call
     */
    private static _gruntContainer:JQuery;
    private static get gruntContainer() : JQuery {

        if (!CyGrunt._gruntContainer) {

            CyGrunt._gruntContainer = $('[data-template="grunt-container-template"]', CyTemplates.templates);

            CyGrunt._gruntContainer.appendTo(CyTemplates.body);
        }

        return CyGrunt._gruntContainer;
    }

    /**
     * when a grunt is closed
     */
    private static gruntClosed() {

        // get the message from the close button

        var message:string = $(this).data("message");

        // remove the grunt from the static list of grunts and the DOM

        var g:CyGrunt = CyGrunt.grunts[message];

        // cancel any pending nudge

        g.unflash();

        delete CyGrunt.grunts[message];

        g.element.remove();

        // if this was the master remove all other grunts as well

        if (g.isMaster) {

            _.each(CyGrunt.grunts, (g:CyGrunt) => {

                g.unflash();

                delete CyGrunt.grunts[g.message];

                g.element.remove();

            });
        }
    }

    // colors for grunts

    public static kORANGE:number = 0;

    public static kGREEN:number = 1;

    public static kBLUE:number = 2;

    public static kRED:number = 3;

    private static colorClasses:string[] = ["grunt-orange", "grunt-green", "grunt-blue", "grunt-red"];

    private static grunts:any = {};

    private static addingRemoveAll:boolean = false;

}

export = CyGrunt;

