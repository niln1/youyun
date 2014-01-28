/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/i18next.d.ts" />
/// <reference path="../.././definitions/modernizr.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />


import CyDialog = require("./cy-dialog");
import CyWidget = require("../component/cy-widget");
import CyTemplates = require('../../util/cy-templates');


/**
 * window that displays the required and actual capabililties of the user's browser.
 * Gives a warning if the users browser doesn't provide all the required features.
 */
class CyCapsWindow extends CyDialog {

    constructor() {

        super({
            width    : 800,
            resizable: false,
            title    : "Browser Capabilities"
        });

        // get the outer console element

        this.console = CyTemplates.cloneTemplate('simple-console-template');

        this.console.prependTo(this.clientArea);

        // get results paragraph

        this.results = $('[data-element="results"]', this.console);

        // get the actual list inside the console

        this.list = $('.simple-list', this.console);

        // add close button

        this.addButton("Close", CyDialog.kMODAL_OK);

        // run tests

        this.addTest(Modernizr.cssanimations, "CSS Animations");

        this.addTest(Modernizr.websockets, "Web Sockets");

        this.addTest(Modernizr.borderradius, "CSS Border Radius");

        this.addTest(Modernizr.localstorage, "Local Storage");

        this.addTest(Modernizr.boxshadow, "CSS Box Shadow");

        this.addTest(Modernizr.cssgradients, "CSS Gradients");

        this.addTest(Modernizr.csstransitions, "CSS Transitions");

        this.addTest(Modernizr.fontface, "CSS Font Faces");

        this.addTest(Modernizr.hashchange, "HTML5 Hash Change");

        this.addTest(Modernizr.history, "HTML5 History");

        this.addTest(Modernizr.opacity, "Opacity");

        this.addTest(Modernizr.generatedcontent, "Generated Content e.g. ::after");

        this.addTest(window.screen.availWidth >= 1024, "Screen width (1024px required), actual:" + window.screen.availWidth + "px");

        this.addTest(window.screen.availHeight >= 768, "Screen height (768px required), actual:" + window.screen.availHeight + "px");

        // report results

        var s:string = "";

        if (this.failed === 0) {

            s = "All tests passed. Your browser is awesome!";

        } else {

            s = this.failed + " tests failed. You may experience problems viewing or running this application.";
        }

        this.results.text(s);

        // center in browser window for now

        this.center();

    }

    /**
     * console list
     */
    private console:JQuery;

    /**
     * inner list of console
     */
    private list:JQuery;

    /**
     * results message
     */
    private results:JQuery;

    /**
     * number of passes and fails
     */
    private passed:number = 0;

    private failed:number = 0;

    /**
     * add a pass fail test
     * @param result
     * @param message
     */
    private addTest(result:boolean, message:string) : void {

        var r:string = result ? 'browser-pass' : 'browser-fail';

        var d:JQuery = CyTemplates.cloneTemplate(r);

        $('.' + r, d).text((result ? "Passed - " : "Failed - ") + message);

        // prepend failures so they show up first

        if (result) {
            d.appendTo(this.list);
        } else {
            d.prependTo(this.list);
        }

        if (result) {
            this.passed += 1;
        } else {
            this.failed += 1;
        }
    }

    /**
     * return identifying information about the alarm viewer
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Browser Capabilities",
            windowType  : CyCapsWindow.kCAPS_WINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify windows
     * @type {string}
     */
    public static kCAPS_WINDOW_TYPE:string = "Browser-Caps-Window";

}

export = CyCapsWindow;

