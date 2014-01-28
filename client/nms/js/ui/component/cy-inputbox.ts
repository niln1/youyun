/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CySettings = require('../../cy-settings');
import CyTemplates = require('../../util/cy-templates');
import CyWidget = require('./cy-widget');

/**
 * input box with autocomplete and clear button
 *
 * @module Component
 * @class CyInputBox
 */
class CyInputBox extends CyWidget {


    /**
     * Construct a new input box with autocomplete options and the name of the object
     * used to persist values on the client
     * @param settings
     * @param options
     */
     constructor(private settings?:string, private options?: kendo.ui.AutoCompleteOptions) {

        // base class first

        super("CyInputBox");

     }

     public buildElement() : JQuery {


         // all inputs persist values, but they are only persisted if settings are specified

         this.savedValues = this.settings ? CySettings.I.read(this.settings, []) : [];

         // cline from template

         var e:JQuery = CyTemplates.cloneTemplate('cyan-autocomplete-template');

         // find input element within template

         this.autoCompleteInput = $('input', e);

         // add our own options to the options object

         var o = this.options || {};

         o['change'] = $.proxy(this.valueChanged, this);

         // add settings as the data source if present

         o['dataSource'] = this.savedValues;

         // turn into kendo auto complete

         this.autoCompleteInput.kendoAutoComplete(o);

         this.autoComplete = this.autoCompleteInput.data('kendoAutoComplete');

         // sink click on clear button to reset autoComplete value

         $('a', e).click(() => {

             // clear input

             this.autoComplete.value("");

             // fire event

             this.trigger(CyInputBox.kCHANGED, {
                 sender: this,
                 value : this.text
             });
         });

         // return the outer element

         return e;
    }

    /**
     * raw input box
     *
     * @property {JQuery} autoCompleteInput
     * @private
     */
    private autoCompleteInput:JQuery;

    /**
     * kendo auto complete object constructed from raw input box
     */
    private autoComplete:kendo.ui.AutoComplete;


    public dispose() : void {

        // cleanup the kendo components

        this.autoComplete.destroy();

        // now base class, which cleans up all CyWidgets and remove all, including
        // non cyan elements from the DOM

        super.dispose();
    }

    /**
     * value changed in autocomplete box
     *
     * @method valueChanged
     * @private
     */
    private valueChanged() : void {

        // add to savedValues if not already presents

        if (this.savedValues.indexOf(this.text) < 0) {

            // add to saved value

            this.savedValues.push(this.text);

            // only keep at most 50 items in the list

            if (this.savedValues.length > 50) {
                this.savedValues.splice(0, 1);
            }

            // update data source

            this.autoComplete.dataSource.data(this.savedValues);

            // update settings

            if (this.settings) {

                CySettings.I.write(this.settings, this.savedValues);
            }
        }

        // trigger change event

        this.trigger(CyInputBox.kCHANGED, {
            sender: this,
            value : this.text
        });
    }

    /**
     * event fired when the value is changed in the input box
     *
     * @property {String} kCHANGED
     * @static
     */
    public static kCHANGED:string = "cyan-inputbox-value-changed";


    /**
     * list of saved objects from settings. Also used to update settings
     *
     * @property {Array} savedValues
     * @private
     */
    private savedValues:string[];

    /**
     * return trimmed string containing the current value
     *
     * @method text
     * @return {String} text
     */
    public get text() : string {

        var s:string = this.autoComplete.value();

        s = s ? s.trim() : "";

        return s;
    }
}

export = CyInputBox;
