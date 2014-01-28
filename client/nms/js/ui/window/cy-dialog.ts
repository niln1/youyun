/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyUtils = require('../../util/cy-utils');
import CyWindow = require('./cy-window');

/**
 * Dialogs are a modal form of CyWindow with additional methods and markup to support a set action buttons
 */
class CyDialog extends CyWindow {

    /**
     * construct a new dialog
     * @param config
     */
     constructor(config?:ICyWindowConfiguration) {

        // chain constructor, while ensuring the modal property is set to true

        super(_.extend({modal:true}, _.omit(config || {}, 'modal')));

        // shift dialogs above overlay

        this.outer.parent().addClass("cy-dialog");

        // construct the button area at the bottom of the content area

        this.buttons = $('<div class="cy-dialog-buttons"></div>').appendTo(this.inner);

        // center ourselves

        this.center();
    }

    /**
     * area for buttons
     */
    private buttons:JQuery;

    /**
     * the modal result of the dialog. This is valid after the dialog is closed and reflects the button
     * used to close the dialog ( or the explicit value passed to closeDialog ).
     * @type {number}
     * @private
     */
    private _modalResult:number = CyDialog.kMODAL_UNKNOWN;
    public get modalResult() : number {
        return this._modalResult;
    }

    /**
     * setting the modal value closes the window in addition to setting the value.
     * @param v
     */
    public set modalResult(v:number) {
        this._modalResult = v;

        this.close();
    }

    /**
     * common modal values, but you can assign any value to a modal button
     * @type {number}
     */
    public static kMODAL_UNKNOWN:number = 0;        // this value should never be associated with a button, but is
                                                    // sent when the dialog is aborted or closed by some method other
                                                    // than one of the modal buttons

    public static kMODAL_OK:number = 1;

    public static kMODAL_CANCEL:number = 2;

    public static kMODAL_YES:number = 3;

    public static kMODAL_NO:number = 4;

    public static kMODAL_APPLY:number = 5;


    /**
     * create a button and add to the dialog. Buttons appear in the order they are added. Any value except zero
     * is acceptable for the modal value
     * @param text
     * @param modalValue
     */
    public addButton(text:string, modalValue:number) {

        CyUtils.assert(text, "The button must have text");

        CyUtils.assert(modalValue, "The modal value cannot be undefined, null or zero");

        // create the button

        var b:JQuery = $('<button class="cyan-dialog-button k-button">' + text + '</button>');

        // map the modal value to it

        b.data(CyDialog.kMODAL_DATA, modalValue);

        // add to buttons panel

        b.appendTo(this.buttons);

        // sink click event and use it to set the modal result

        b.click((a:Event) => {

            this.modalResult = $(a.currentTarget).data(CyDialog.kMODAL_DATA);
        });

        // return dialog for chaining

        return this;
    }

    /**
     * Enables a button or disables it
     * @param modalValue    the modal value assigned to the button
     * @param enable        set to true to enable, false to disable
     */
    public enableButton(modalValue : number, enable : boolean = true) {

        this.buttons.children().each(function (idx, button) {

            var b = $(button);

            if (b.data(CyDialog.kMODAL_DATA) == modalValue) {

                if (enable) {
                    b.removeAttr('disabled');
                } else {
                    b.attr('disabled', 'disabled');
                }
            }
        });
    }

    /**
     * string key used to embed the modal value of a button into the .data store property of its jquery selector
     * @type {string}
     */
    private static kMODAL_DATA:string = "modal-value";

    /**
     * create and run a simple modal message dialog with the optional buttons. Buttons should be specified as simple
     * modal values. The appropriate text will be selected for you.
     * @param title
     * @param payload
     * @param args
     */
    public static messageDialog(title:string, payload:string, ...args:any[]) : CyDialog {

        CyUtils.assert(title, "You must specify a title");

        CyUtils.assert(payload, "You must specify a payload");

        // create dialog

        var d:CyDialog = new CyDialog({

            resizable: false,
            title: title

        });

        // add buttons

        for(var i:number = 0; i < args.length; i += 1) {

            var text:string = "NOT DEFINED";

            switch (args[i]) {

                case CyDialog.kMODAL_OK: text = "Ok"; break;
                case CyDialog.kMODAL_CANCEL: text = "Cancel"; break;
                case CyDialog.kMODAL_YES: text = "Yes"; break;
                case CyDialog.kMODAL_NO: text = "No"; break;
                case CyDialog.kMODAL_APPLY: text = "Apply"; break;

            }

            d.addButton(text, args[i]);
        }


        // set client area to pre element containing html, insert before the button panel.
        // Add a bottom margin to the message to separate cleanly from the button area.

        $('<p style="margin:0 0 1em 0">' + payload + '</p>').insertBefore(d.buttons);

        d.center();

        return d;

    }

    /**
     * create and run a simple modal message dialog with the optional buttons. Buttons should be specified as simple
     * modal values. The appropriate text will be selected for you.
     * @param title
     * @param payload
     * @param args
     */
    public static textDialog(title:string, payload:string, ...args:any[]) : CyDialog {

        CyUtils.assert(title, "You must specify a title");

        CyUtils.assert(payload, "You must specify a payload");

        // create dialog

        var d:CyDialog = new CyDialog({

            resizable: false,
            title: title

        });

        // add buttons

        for(var i:number = 0; i < args.length; i += 1) {

            var text:string = "NOT DEFINED";

            switch (args[i]) {

                case CyDialog.kMODAL_OK: text = "Ok"; break;
                case CyDialog.kMODAL_CANCEL: text = "Cancel"; break;
                case CyDialog.kMODAL_YES: text = "Yes"; break;
                case CyDialog.kMODAL_NO: text = "No"; break;
                case CyDialog.kMODAL_APPLY: text = "Apply"; break;

            }

            d.addButton(text, args[i]);
        }


        // set client area to pre element containing html, insert before the button panel.
        // Add a bottom margin to the message to separate cleanly from the button area.

        $('<textarea style="margin: 0 0 1em 0; width:800px;resize:none" rows="20">' + payload + '</textarea>').insertBefore(d.buttons);

        d.center();

        return d;

    }
}

export = CyDialog