/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/i18next.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />
/// <reference path="../interface/i-date-picker.d.ts" />

import CyDialog = require("./cy-dialog");
import CyTemplates = require("../../util/cy-templates");

/**
 * @class CyDateTimePicker
 */
class CyDateTimePicker extends CyDialog {

    /**
     * Creates a date picker control as a modal dialog
     * @class CyDatePicker
     * @param title
     * @param range
     */
    constructor(title : string = "DateTime Picker", dateRange? : IDatePickerRange, timeRange? : IDatePickerRange, includeTime : boolean = true)  {

        super({
            resizable: false,
            title: title
        });

        this.dateRange = dateRange;
        this.timeRange = timeRange;

        var container = CyTemplates.cloneTemplate('cyan-date-time-picker-template');

        // goes before button

        container.prependTo(this.clientArea);

        // options to pass to the calendar and time picker

        var calOptions:any = {};
        var timeOptions:any = {};

        if (this.dateRange) {

            calOptions.min = CyDateTimePicker.convertToDate(dateRange.min);
            calOptions.max = CyDateTimePicker.convertToDate(dateRange.max);

        }

        if (this.timeRange) {
            timeOptions.min = CyDateTimePicker.convertToDate(timeRange.min);
            timeOptions.max = CyDateTimePicker.convertToDate(timeRange.max);
        }

        // setup kendo components and events

        this.dateElement = $('[data-element=date]', container);
        this.calendar = this.dateElement.kendoCalendar(calOptions).data('kendoCalendar');
        this.calendar.bind('change', $.proxy(this.onDateChange, this));

        if (includeTime) {

            this.timeElement = $('[data-element=time]', container);
            this.timeElement.bind('keydown blur', $.proxy(this.onTimeInputChange, this));

            this.timePicker = this.timeElement.kendoTimePicker(timeOptions).data('kendoTimePicker');
            this.timePicker.bind('change', $.proxy(this.onTimeChange, this));
        } else {
            $('[data-element=time]', container).hide();
        }

        // add dialog buttons

        this.addButton('Ok', CyDialog.kMODAL_OK);
        this.addButton('Cancel', CyDialog.kMODAL_CANCEL);

        // disable ok button by default

        this.enableButton(CyDialog.kMODAL_OK, false);

        this.center();
    }

    /**
     * return identifying information about this window
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Date Time Picker Window",
            windowType  : CyDateTimePicker.kWINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify windows
     * @type {string}
     */
    public static kWINDOW_TYPE:string = "Date-Time-Picker-Window";

    /**
     * date element
     */
    private dateElement:JQuery;

    /**
     * calendar widget for the date element
     */
    private calendar:kendo.ui.Calendar;

    /**
     * time element
     */
    private timeElement:JQuery;

    /**
     * timer picker widget for the time element
     */
    private timePicker:kendo.ui.TimePicker;

    /**
     * Calendar picker change
     * @param e
     */
    private onDateChange(e) {

        var date = this.calendar.value();

        if (this.timePicker && !this.timePicker.value()) {
            this.timePicker.value(date);
        }

        this.validateDateTime();
    }

    /**
     * Called when time element looses focus or enter is pressed
     * @param e
     * @returns {*}
     */
    private onTimeInputChange(e) {

        // since this gets fired for blur event and keydown, I only want to update for blur and enter key
        if ('keyCode' in e && e.keyCode != 13) {
            return;
        }

        this.timePicker.value($(e.target).val());

    }

    /**
     * Time picker change
     * @param e
     */
    private onTimeChange(e) {

        this.validateDateTime();

    }

    /**
     * date time object
     */
    public get dateTime() : Moment {

        if (this.timePicker && this.timePicker.value()) {

            return CyDateTimePicker.convertToMoment(this.calendar.value(), this.timePicker.value());
        } else {
            return CyDateTimePicker.convertToMoment(this.calendar.value());
        }

    }

    /**
     * setter for datetime which adjusts the widgets value accordingly
     * @param value
     */
    public set dateTime(value : Moment) {

        this.calendar.value(CyDateTimePicker.convertToDate(value));

        this.timePicker.value(CyDateTimePicker.convertToDate(value));

    }

    /**
     * validate if the date time retrieved from the picker is valid
     */
    private validateDateTime() : void {

        var datetime = this.dateTime;
        var valid = true;

        // since kendo prevents the user from selecting beyond a range, there is little to no validation left to do
        // i hope

        if (datetime) {
            this.enableButton(CyDialog.kMODAL_OK, true);
        } else {
            this.enableButton(CyDialog.kMODAL_OK, false);
        }
    }

    /**
     * Converts Date into moment utc dates
     * @param date
     * @param time
     * @returns {Moment}
     */
    private static convertToMoment(date : Date, time? : Date) {

        if (!date) return null;

        if (!time) time = date;

        return moment.utc([ date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds() ]);
    }

    /**
     * Converts moment dates into a Date
     * @param momentDate
     * @returns {Date}
     */
    private static convertToDate(momentDate) {
        return new Date(momentDate.years(), momentDate.months(), momentDate.date(), momentDate.hours(), momentDate.minutes(), momentDate.seconds() );
    }

    /**
     * min/max for date
     * @type IDatePickerRange
     * @private
     */
    private dateRange:IDatePickerRange;

    /**
     * min/max for time
     * @type IDatePickerRange
     * @private
     */
    private timeRange:IDatePickerRange;

}

export = CyDateTimePicker;