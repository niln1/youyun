/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/i18next.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyDialog = require("./cy-dialog");
import CyTemplates = require("../../util/cy-templates");

/**
 * the various parts of a single date/time picker. The kendo calendar and hh:mm:ss inputs
 */
interface pickerParts {

    calendar:kendo.ui.Calendar;

    hours:JQuery;

    minutes:JQuery;

    seconds:JQuery;
}

/**
 * @class CyAlarmRangePicker
 */
class CyAlarmRangePicker extends CyDialog {


    constructor(starting:Moment, ending:Moment) {

        super({
            resizable: false,
            title: "Alarm Range Picker"
        });

        var client:JQuery = CyTemplates.cloneTemplate('cyan-alarm-ranges-template');

        // create calendars / time pickers [start, end]

        this.start = this.buildComponents('start', client);

        this.end = this.buildComponents('end', client);

        // goes before button

        client.prependTo(this.clientArea);


        // add dialog buttons

        this.addButton('Apply', CyDialog.kMODAL_OK);

        this.addButton('Cancel', CyDialog.kMODAL_CANCEL);


        // set initial time range

        this.setDateTime(this.start, starting);

        this.setDateTime(this.end, ending);


        // set apply button to its initial state

        this.setApplyButtonState();

        // center in window

        this.center();
    }

    /**
     * build an aggregate all the components of one calendar + time components
     * @param prefix
     * @param client
     * @returns {*}
     */
    private buildComponents(prefix:string, client:JQuery):pickerParts {

        var pp:any = {};

        // build calendar

        $('[data-element="' + prefix + '-cal"]', client).kendoCalendar({change: () => {

            // use change event to update state of apply button

            this.setApplyButtonState();

        }});

        // get the kendo object

        pp.calendar = $('[data-element="' + prefix + '-cal"]', client).data("kendoCalendar");

        // get hours / minutes / seconds inputs

        pp.hours = $('[data-element="' + prefix + '-hour"]', client);

        pp.minutes = $('[data-element="' + prefix + '-minutes"]', client);

        pp.seconds = $('[data-element="' + prefix + '-seconds"]', client);

        // limit all inputs to numbers only

        $('input', client).keypress((e:JQueryKeyEventObject) => {

            if (e.charCode < 48 || e.charCode > 57) return false;

            return true;
        });

        // set apply button state after keyup
        $('input', client).keyup((e:JQueryKeyEventObject) => {

            this.setApplyButtonState();
        });

        // update apply button state after all input changes

        $('input', client).change(() => {

            this.setApplyButtonState();

        })

        // validate and correct hours / minutes / seconds on blur

        pp.hours.blur((e:JQueryEventObject) => {

            this.clampInput($(e.target), 0, 23);

        });

        pp.minutes.blur((e:JQueryEventObject) => {

            this.clampInput($(e.target), 0, 59);

        });

        pp.seconds.blur((e:JQueryEventObject) => {

            this.clampInput($(e.target), 0, 59);

        });

        // return the parts

        return pp;
    }

    /**
     * clamp the input to the given range. An empty value is left alone
     * @param i
     * @param min
     * @param max
     */
    private clampInput(i:JQuery, min:number, max:number) : void {

        // get value

        var s = i.val().trim();

        // ignore empty strings

        if (s.length === 0) {

            i.val("");

            return;
        }

        // parse to int

        var v = parseInt(s);

        // fix is didn't parse of out of range

        if (_.isNaN(v)) {

            v = min;

        } else {

            if (v < min)  {

                v = min;

            } else {

                if (v > max) {

                    v = max;
                }
            }
        }

        // ensure input has corrected value

        i.val(v.toString());


    }

    /**
     * works like clampInput but does NOT correct any errors. Used while the user edits the controls
     * to determine of the Apply button can be enabled
     * @param i
     * @param min
     * @param max
     */
    private isInputValid(i:JQuery, min:number, max:number) : boolean {

        // get value

        var s = i.val().trim();

        // empty string is valid, will be zero

        if (s.length === 0) {

            return true;
        }

        // parse to int

        var v = parseInt(s);

        // fix is didn't parse of out of range

        if (_.isNaN(v)) {

            return false;

        } else {

            if (v < min)  {

                return false;

            } else {

                if (v > max) {

                    return false;
                }
            }
        }

        // if we get here it is all good

        return true;
    }

    /**
     * start / end component aggregates
     */
    private start:pickerParts;

    private end:pickerParts;

    /**
     * set one of the components to the given date/time
     * @param p
     * @param d
     */
    private setDateTime(p:pickerParts, m:Moment) {

        // calendar can be set directly from Date object

        //var d:Date = new Date(Date.UTC(m.year(), m.month(), m.date(), 0, 0, 0, 0));

        var d:Date = new Date(m.valueOf());

        // of course Javascript will faithfully add in our local time zone and the calendar will display it...
        // so the best hack is to simply add our offset to the date

        d = new Date(d.getTime() + d.getTimezoneOffset() * 1000 * 60);

        // to be extra safe remove time from date

        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        // now set in calendar

        p.calendar.value(d);

        // hh:mm:ss into input boxes

        p.hours.val(m.hours());

        p.minutes.val(m.minutes());

        p.seconds.val(m.seconds());

    }

    /**
     * enable or disable the apply button according to whether the current date/time range is valid.
     */
    private setApplyButtonState() : void {

        var valid:boolean = true;

        // test all hh:mm:ss parts first

        if (!this.isInputValid(this.start.hours, 0, 23)) {

            valid = false;
        }

        if (!this.isInputValid(this.start.minutes, 0, 59)) {

            valid = false;
        }

        if (!this.isInputValid(this.start.seconds, 0, 59)) {

            valid = false;
        }

        if (!this.isInputValid(this.end.hours, 0, 23)) {

            valid = false;
        }

        if (!this.isInputValid(this.end.minutes, 0, 59)) {

            valid = false;
        }

        if (!this.isInputValid(this.end.seconds, 0, 59)) {

            valid = false;
        }

        // if times look valid, get the full start/end date and ensure the range is positive

        if (this.endDateTime.valueOf() < this.startDateTime.valueOf()) {

            valid = false;
        }

        // now set the button state

        this.enableButton(CyDialog.kMODAL_OK, valid);

    }

    /**
     * return the currently set Date/Time. This can be called anytime since validation is applied when called.
     * Generally, it should only be called when the dialog is closed with the modal value CyDialog.kMODAL_OK
     */
    public get startDateTime() : Moment {

        return this.timestampToMoment(this.getDateTime(this.start).getTime());
    }

    /**
     * same as start Date/Time but returns the end date time. The user cannot close the dialog when
     * they have an invalid date/time specific ( including a negative range ). Therefore this should
     * only be called when the dialog is closed with the modal value CyDialog.kMODAL_OK
     */
    public get endDateTime() : Moment {

        return this.timestampToMoment(this.getDateTime(this.end).getTime());
    }

    /**
     * construct a UTC moment from what we assume is a UTC MS timestamp
     * @param timestampMS
     */
    private timestampToMoment(timestampMS:number):Moment {

        // NOTE: Parsing dates from unix epochs / MS or from javascript Date objects is tricky
        // Both libraries make assumptions about the time zone and then apply some adjustment
        // when constructing new objects. Further, setting the timezone after construction
        // will adjust the time!
        // Therefore this seems to be the only way to construct a 'moment' object in UTC
        // given a UTC timestamp. 1. construct a JS date object then use the moment UTC constructor
        // to create a time using the actual year,month, day, hour, minute, second values

        var a:Date = new Date(timestampMS);

        var b:Moment = moment.utc([a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds()]);

        return b;
    }


    /**
     * validate and return the current date/time in one of the range picker halves
     * @param parts
     * @returns {Date}
     */
    private getDateTime(parts:pickerParts) : Date {

        // first clamp the time picker values to ensure they are valid

        this.clampInput(parts.hours, 0, 23);

        this.clampInput(parts.minutes, 0, 59);

        this.clampInput(parts.seconds, 0, 59);

        // first get the date from the calendar.

        var d:Date = parts.calendar.value();

        // set hh:mm:ss from ticker picker

        var hours:number = parseInt(parts.hours.val());

        if (_.isNaN(hours)) {
            hours = 0;
        }

        var minutes:number = parseInt(parts.minutes.val());

        if (_.isNaN(minutes)) {
            minutes = 0;
        }

        var seconds:number = parseInt(parts.seconds.val());

        if (_.isNaN(seconds)) {
            seconds = 0;
        }

        // set final date time

        d.setHours(hours);

        d.setMinutes(minutes);

        d.setSeconds(seconds);

        // clear MS

        d.setMilliseconds(0);

        return d;
    }

}


export = CyAlarmRangePicker;