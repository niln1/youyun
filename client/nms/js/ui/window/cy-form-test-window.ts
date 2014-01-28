/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/i18next.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />


import CyDialog = require("./cy-dialog");
import CyWidget = require("../component/cy-widget");
import CyTemplates = require('../../util/cy-templates');


/**
 * for testing the news forms and columns library
 */
class CyFormTestWindow extends CyDialog {

    constructor() {

        super({
            width    : 1024,
            height   : 768,
            resizable: true,
            title    : "Form Test Capabilities"
        });

        // get the outer console element

        this.formTest = CyTemplates.cloneTemplate('form-test-template');

        this.formTest.prependTo(this.clientArea);

        // setup kendo controls

        // combo box

        $("#selector1").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: "Cotton", value: "1" },
                { text: "Polyester", value: "2" },
                { text: "Cotton/Polyester", value: "3" },
                { text: "Rib Knit", value: "4" }
            ],
            filter: "contains",
            suggest: true
        });

        // drop down

        var data = [
            { text: "Black", value: "1" },
            { text: "Orange", value: "2" },
            { text: "Grey", value: "3" }
        ];

        // create DropDownList from input HTML element
        $("#selector2").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            index: 0
        });

        // center in browser window for now

        this.center();

    }

    /**
     * primary content for window
     */
    private formTest:JQuery;



    /**
     * return identifying information about the alarm viewer
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Forms / Grid Test",
            windowType  : CyFormTestWindow.kFORM_TEST_WINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify windows
     * @type {string}
     */
    public static kFORM_TEST_WINDOW_TYPE:string = "Form-Test-Window";

}

export = CyFormTestWindow;


