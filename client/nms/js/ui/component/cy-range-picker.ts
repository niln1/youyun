/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CyTemplates = require('../../util/cy-templates');
import CyWidget = require('./cy-widget');

/**
 * combo date pickers for date ranges
 *
 * @class CyRangePicker
 * @module CyUI
 * @submodule Component
 */
class CyRangePicker extends CyWidget {

    /**
     * Creates two datetime pickers for start/end times.  Takes an element and optional kendo options for the
     * start and end date time pickers.
     *
     * @class CyRangePicker
     * @constructor
     * @param element
     * @param startOptions
     * @param endOptions
     */
        constructor(private startOptions?:kendo.ui.DateTimePickerOptions, private endOptions?:kendo.ui.DateTimePickerOptions) {

        super("CyRangePicker");
    }

    /**
     * build the component and return the outer jquery selector
     */
    public buildElement():JQuery {

        // construct element from template

        var e = CyTemplates.cloneTemplate('range-picker-template');

        // setting up options for the start picker

        var optStart = _.extend({

            value: CyRangePicker.getUTCTime(-(1000 * 60 * 60 * 24 * 7)),

            change: $.proxy(this.onStartChanged, this)

        }, this.startOptions);

        // setting up options for the end picker

        var optEnd = _.extend({

            value: CyRangePicker.getUTCTime(0),

            change: $.proxy(this.onEndChanged, this)

        }, this.endOptions);

        // initialize the date time pickers

        this.startPicker = $('[data-element=start]', e).kendoDateTimePicker(optStart).data("kendoDateTimePicker");

        this.endPicker = $('[data-element=end]', e).kendoDateTimePicker(optEnd).data("kendoDateTimePicker");

        // return the outer element

        return e;
    }

    /**
     * clean up the kendo widgets etc
     */
    public dispose() {

        super.dispose();

        if (this.startPicker) {

            this.startPicker.destroy();

            this.endPicker.destroy();
        }
    }

    /**
     * Event handler for when the start picker value changes
     * @method onStartChange
     * @param e
     * @private
     */
    private onStartChanged(e:any) {

        if (!this.validate()) {

            this.startPicker.value(this.endPicker.value());

        }

        this.trigger(CyRangePicker.kSTART_PICKER_CHANGED, {
            sender: this,
            value: this.startPicker.value()
        });

    }

    /**
     * Event handler for when the end picker value changes
     * @method onEndChange
     * @param e
     * @private
     */
    private onEndChanged(e:any) {

        if (!this.validate()) {

            this.endPicker.value(this.startPicker.value());

        }

        this.trigger(CyRangePicker.kEND_PICKER_CHANGED, {
            sender: this,
            value: this.endPicker.value()
        });

    }

    /**
     * Used to determine if the current date ranges are valid
     * @method validate
     * @returns {boolean}
     * @private
     */
    private validate() {

        if (this.startPicker.value().getTime() <= this.endPicker.value().getTime()) {

            return true;

        } else {

            return false;

        }
    }

    /**
     * return the UTC time +/- the given number of ms
     * @method getUTCTime
     * @param delta
     * @returns {Date}
     */
    private static getUTCTime(delta:number):Date {

        // get local time

        var d = new Date();

        // add delta

        d.setTime(d.getTime() + delta);

        // convert to UTC and return

        return new Date(
            d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate(),
            d.getUTCHours(),
            d.getUTCMinutes(),
            d.getUTCSeconds()
        );
    }

    /**
     * Returns the current start date
     * @property startDate
     * @returns {Date}
     * @public
     */
    public get startDate():Date {

        return this.startPicker.value();

    }

    /**
     * Returns the current end date
     * @property endDate
     * @returns {Date}
     * @public
     */
    public get endDate():Date {

        return this.endPicker.value();

    }

    /**
     * kendo datetime picker widget for start time
     * @property startPicker
     */
    private startPicker:kendo.ui.DateTimePicker;

    /**
     * kendo datetime picker widget for end time
     * @property endPicker
     */
    private endPicker:kendo.ui.DateTimePicker;

    /**
     * Triggered when start picker value changes
     * @event kSTART_PICKER_CHANGED
     */
    public static kSTART_PICKER_CHANGED = 'cyan-range-start-picker-changed';

    /**
     * Triggered when end picker value changes
     * @event kEND_PICKER_CHANGED
     */
    public static kEND_PICKER_CHANGED = 'cyan-range-start-picker-changed';

    public static get defaultRange():any[] {

        return [ CyRangePicker.getUTCTime(-(1000 * 60 * 60 * 24 * 7)), CyRangePicker.getUTCTime(0) ]
    }
}

export = CyRangePicker

