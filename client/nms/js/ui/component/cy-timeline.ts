/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../../definitions/moment.d.ts" />
/// <reference path="../../interfaces/i-timeline.d.ts" />

import CyTemplates = require('../../util/cy-templates');
import CyWidget = require('./cy-widget');
import CyAlarmViewer = require('./cy-alarm-viewer');

/**
 * timeline with dynamic bars
 */
class CyTimeline extends CyWidget {


    /**
     * construct a new timeline widget, passing the owning AlarmViewer so datetime range etc
     * can be updated
     * @param viewer
     */
        constructor(private alarmGraph:CyAlarmViewer.AlarmGraph) {

        // base class first

        super("CyTimeline");

        // set default time range to approximately 24 hours

        this._centerTime = moment.utc().subtract('hours', 12);

        // reset elements

        this.te = [];

    }

    /**
     * it is very easy to introduce bugs by accidentally converting a datetime (moment) to
     * a local time ( from UTC ). This method is used for internal validation and some tests
     * to ensure that all datetime properties are in UTC
     */
    public validate():void {

        if (this._centerTime && this.centerTime.zone() !== 0) {
            throw new Error("Local Time detected");
        }

        if (this._centerTime && this.startTime.zone() !== 0) {
            throw new Error("Local Time detected");
        }

        if (this._centerTime && this.endTime.zone() !== 0) {
            throw new Error("Local Time detected");
        }

        if (this.minTime && this.minTime.zone() !== 0) {
            throw new Error("Local Time detected");
        }

        if (this.maxTime && this.maxTime.zone() !== 0) {
            throw new Error("Local Time detected");
        }

        if (this.dt && this.dt.zone() !== 0) {
            throw new Error("Local Time detected");
        }
    }

    /**
     * add the given elements to the currently displayed ones
     * @param e
     */
    public addElements(e:timelineElement[]):void {

        // ignore empty data sets

        if (!(e && e.length)) {
            return;
        }

        // record time of add...everything forward of this is considered the 'future'

        this.loadTime = moment.utc();

        // lock updates

        this.beginUpdate();

        // add the cystart, cyend properties to each element

        _.each(e, (v) => {

            v.cystart = this.timestampToMoment(v.start);

            v.cyend = this.timestampToMoment(v.end);

        });

        // remove all old bars

        this.removeBars();

        // remove old tooltips

        if (this.tooltip) {

            this.tooltip.destroy();

            this.tooltip = null;
        }

        // join new elements with existing elements

        this.te = this.te.concat(e);

        if (this.te.length) {

            // establish limits of time line to the

            this.resetTimeLimits();

            // optimize scale for this data set

            this.optimizeRange();

            // new layout

            this.layout();

            // hide no alarms label

            this.emptyLabel.addClass('hidden');

            // show time scale and slider area

            this.slider.removeClass('hidden');

            this.timescale.removeClass('hidden');

            // show zoom buttons

            this.zoomHolder.removeClass('hidden');

            // make future marker visible

            this.future.removeClass('hidden');

            // group bars by 'id' property, produces an object with key(s) === element.id and value(s) === elements with that 'id'

            var temp = _.groupBy(this.te, "id");

            // now map to an array or arrays

            this.barMap = _.map(temp, function (element:any) {

                return element;
            });

            // sort the bapMap simply by comparing the ID of the first element of the array

            this.barMap.sort((a:any, b:any) => {

                //return b[0].id.localeCompare(a[0].id);
                return this.naturalSort(b[0].id, a[0].id);
            });

            // setup tooltips on all .alarm-bar elements

            this.tooltip = this.element.kendoTooltip({

                filter: ".alarm-bar",
                animation: {
                    open: { effects: "fade:in", duration: 250 },
                    close: { effects: "fade:out", duration: 250 }
                },
                position: "top",
                showAfter: 400,
                content: (e:any) => {

                    // get alarm object from bar

                    var alarmElement = e.target.data('bar-element');

                    if (alarmElement) {

                        if (!this.tooltipTemplate) {

                            this.tooltipTemplate = CyTemplates.compileTemplate('cy-timeline-tooltip-template');
                        }

                        return this.tooltipTemplate({
                            nodeid: alarmElement.id,
                            severity: alarmElement.severity,
                            text: alarmElement.text,
                            pcause: alarmElement.probcause,
                            started: this.momentLongFormat(alarmElement.cystart),
                            ended: this.momentLongFormat(alarmElement.cyend)
                        });

                    } else {

                        return false;
                    }
                }
            }).data("kendoTooltip");
        }

        // redraw

        this.endUpdate();

        // update hidden bars ( after endUpdate to ensure the bars exist )

        this.updateHiddenBars();

    }

    /**
     * handlebars template for tooltips
     */
    private tooltipTemplate:any;

    /**
     * tooltip object for alarm bars
     */
    private tooltip:kendo.ui.Tooltip;

    /**
     * remove all bars from the display
     */
    private removeBars():void {

        if (this.barMap && this.barMap.length) {

            _.each(this.barMap, (barArray:any) => {

                _.each(barArray, (bar:any) => {

                    if (bar.element) {
                        bar.element.remove();
                    }
                });
            });
        }

        this.barMap = [];

    }


    private naturalSort(a, b) {

        var oFxNcL,oFyNcL;

        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            sre = /(^[ ]*|[ ]*$)/g,
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
        // convert all to strings and trim()
            x = a.toString().replace(sre, '') || '',
            y = b.toString().replace(sre, '') || '',
        // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
            xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
            yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null;
        // first try and sort Hex codes or Dates
        if (yD)
            if ( xD < yD ) return -1;
            else if ( xD > yD )	return 1;
        // natural sorting through split numeric strings and default strings
        for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (_.isNaN(oFxNcL) !== _.isNaN(oFyNcL)) return (_.isNaN(oFxNcL)) ? 1 : -1;
            // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
                oFxNcL += '';
                oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) return -1;
            if (oFxNcL > oFyNcL) return 1;
        }
        return 0;
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
     * convert a moment ( assumed to be in UTC ) to Date object in UTC
     * NOTE: Even though you are constructing the Date object with UTC values it will ALWAYS display itself
     * in local time. This is a nature of Date objects. However, the unix epoch value will be correct.
     * @param m
     * @constructor
     */
    private momentToDate(m:Moment):Date {

        return new Date(Date.UTC(m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds()));
    }

    /**
     * Replaces existing timeline elements with a new set of data
     * @param e
     */
    public replaceElements(e:timelineElement[]):void {

        // reset timeline elements

        this.te = [];

        // hide no alarms label

        this.emptyLabel.removeClass('hidden');

        // show time scale and slider area

        //this.slider.addClass('hidden');

        this.timescale.addClass('hidden');

        // show zoom buttons

        this.zoomHolder.addClass('hidden');

        // hide future

        this.future.addClass('hidden');

        // remove all existing labels and bars

        this.removeLabels();

        this.removeBars();

        // remove timescale elements

        this.removeTimeScaleElements();

        // reset mouse label

        this.mouseLabel.text("");

        // add the new elements

        this.addElements(e);
    }

    /**
     * sets minTime maxTime to the limits of our elements. The left edge of timeline cannot go below minTime
     * and the right edge beyond maxTime ( within the additional scaling constraints )
     */
    private resetTimeLimits():void {

        // calculate limits as moments

        var min:number = Number.MAX_VALUE;

        var max:number = -Number.MAX_VALUE;

        _.each(this.te, function (e) {

            min = Math.min(e.cystart.valueOf(), min);

            max = Math.max(e.cyend.valueOf(), max);

        }, this);

        // now wrap into moment

        this.minTime = moment.utc(min);

        this.maxTime = moment.utc(max);
    }

    /**
     * calculate the optimal scale for the current limits. Due to upper / lower constraints on the scale
     * this may not fully succeed but typically the left and right edge of the timelime will be set
     * to the limits of the current data set
     */
    private optimizeRange():void {

        // get range of data in MS

        var range:number = this.maxTime.valueOf() - this.minTime.valueOf();

        // set scale

        this.spp = this.contentWidth / (range / 1000);

        // set center time to mid point, by creating a moment in unix MS

        this.centerTime = moment.utc(this.minTime.valueOf() + range / 2);

    }

    /**
     * used to optimize updates, use beginUpdate endUpdate to perform updates without rendering
     */
    private updateCount:number = 0;

    /**
     * prevent rendering updates
     */
    private beginUpdate():void {

        this.updateCount++;
    }

    /**
     * allow updates ( if this is the last nested called to endUpdate )
     */
    private endUpdate():void {

        if (this.updateCount === 0) {
            throw new Error("Unbalanced call to endUpdate");
        }

        this.updateCount--;

        if (this.updateCount === 0) {

            // perform a full update with no delay

            this._resize();

        }
    }

    /**
     * return true if we are empty and have no data
     */
    private get empty():boolean {

        return !(this.te && this.te.length);
    }


    /**
     * time bounds for timeline
     */
    private minTime:Moment;

    private maxTime:Moment;

    /**
     * current elements
     */
    private te:timelineElement[];

    /**
     * call whenever the size of the widget is changed. It will attempt to keep the same
     * time range displayed by adjusting the scaling.
     * This must also be called after adding to the DOM
     */
    private _resize():void {

        // ignore while locked or no data

        if (this.updateCount || this.empty) {
            return;
        }

        // set height of content area to required height
        // There is min-height on the CSS which prevents it getting too small to be visible

        var bars = !this.empty ? this.barMap.length : 0;

        this.contentHeight = Math.max(bars * ( CyTimeline.kBAR_HEIGHT + CyTimeline.kBAR_PAD ) + CyTimeline.kTOP_PAD,
            CyTimeline.kMIN_CONTENT_HEIGHT);

        // cause content width to be recalculated

        this._contentWidth = NaN;

        // set height

        this.content.css({height: this.contentHeight });

        // ensure thumb is centered

        this.centerThumb();

        // now we have the metrics we can layout

        this.layout();

    }

    public resize = _.debounce($.proxy(this._resize, this), 100);

    /**
     * current height of content area
     */
    private contentHeight:number;

    /**
     * last recorded width of content area
     */
    private _contentWidth:number = NaN;
    private get contentWidth():number {

        if (_.isNaN(this._contentWidth)) {
            this._contentWidth = this.content.width();
        }
        return this._contentWidth;
    }

    /**
     * width of scroller thumb
     */
    private thumbWidth:number = NaN;

    /**
     * call when the zoom/time range or other elements on the view change.
     * Does a complete layout of all element BUT NOT INCLUDING calculating
     * the size metrics which is done in the resize method
     */
    public layout():void {

        // ignore while locked or no data

        if (this.updateCount || this.empty) {
            return;
        }

        // update labels used to display the element ID's at the left edge of the graph

        this.updateElementLabels();

        // now we have an array of array, where position in the array indicates element ID and therefore height above the baseline
        // and the 2nd dimension array are the actual elements with that ID

        // add/update all bars

        _.each(this.barMap, (barArray:any) => {

            _.each(barArray, (bar:any) => {

                // create bar as necessary

                if (!bar.element) {

                    // create DOM element

                    bar.element = $('<div class="alarm-bar"></div>');

                    // add user supplied class

                    bar.element.addClass(bar.cssclass);

                    // set title for tooltip

                    bar.element.prop('title', bar.text);

                    // store the bar element in the DOM element

                    bar.element.data('bar-element', bar);

                    // add hidden class if required

                    if (this.hiddenClasses.indexOf(bar.cssclass) >= 0) {

                        bar.element.addClass('hidden');
                    }

                    // add to timeline

                    bar.element.appendTo(this.content);

                    // add enter / leave events for highlighting

                    bar.element.bind('mouseenter', $.proxy(this.mouseEnterBar, this));

                    bar.element.bind('mouseleave', $.proxy(this.mouseLeaveBar, this));

                }

            });
        });

        // update all bars

        this.updateDisplay();
    }

    /**
     * mouse enter bar
     * @param e
     */
    private mouseEnterBar(e:JQueryMouseEventObject):void {

        // get the bar the mouse entered

        var b:timelineElement = <timelineElement>$(e.target).data('bar-element');

        // find the group that this bar belongs to

        for (var i:number = 0; i < this.barMap.length; i += 1) {

            if (this.barMap[i].indexOf(b) >= 0) {

                // highlight the corresponding label

                $($('.alarm-timeline-idlabel', this.content)[i]).addClass('alarm-timeline-idlabel-selected');

                // all done

                return;
            }
        }
    }

    /**
     * mouse leave bar
     * @param e
     */
    private mouseLeaveBar(e:JQueryMouseEventObject):void {

        // remove selected style from all labels

        $('.alarm-timeline-idlabel', this.content).removeClass('alarm-timeline-idlabel-selected');
    }

    /**
     * update element labels for all grouped elements
     */
    private updateElementLabels():void {

        // ignore while locked or no data

        if (this.updateCount || this.empty) {
            return;
        }

        // remove all old elements

        this.removeLabels();

        // iterate elements groups by ID

        for (var i = 0; i < this.barMap.length; i += 1) {

            // just grab the ID from the first element in the group

            var id = this.barMap[i][0].id;

            // create DOM element and display

            var e = $('<div class="alarm-timeline-idlabel"></div>');

            e.text(id);

            e.appendTo(this.content);

            // position

            e.css({
                top: this.contentHeight - ((i + 1) * (CyTimeline.kBAR_HEIGHT + CyTimeline.kBAR_PAD) + CyTimeline.kBAR_BORDER)
            });

            // add to list

            this.labelElements = this.labelElements || [];

            this.labelElements.push(e);
        }
    }

    /**
     * remove all alarm labels
     */
    private removeLabels():void {

        while (this.labelElements && this.labelElements.length) {

            var e:JQuery = this.labelElements.pop();

            e.remove();
        }
    }

    private labelElements:JQuery[];

    /**
     * Update the position/width of all bars and. This can be called whenever the view
     * is scrolled or scaled. The bars use CSS transitions to should smoothly transition to
     * new positions.
     * Also update the displayed time range
     */
    private updateDisplay() {

        // ignore while locked or no data

        if (this.updateCount || this.empty) {
            return;
        }

        // update each bar

        _.each(this.barMap, (barArray:any, index?:any) => {

            _.each(barArray, (bar:any) => {

                this.updateBar(bar, index);
            });
        });

        // update time scale

        this.updateTimeScale();

        // update start/end labels

        this.startLabel.html(this.momentFormat(this.startTime, "ddd, Do MMM YYYY HH:mm:ss"));

        this.endLabel.html(this.momentFormat(this.endTime, "ddd, Do MMM YYYY HH:mm:ss"));

        // highlight any part of the timeline which is in the future

        this.highlightFuture();

    }

    /**
     * the time when elements were last added to the timeline UTC
     */
    private loadTime:Moment;

    /**
     * highlight any part of the timeline in the future
     */
    private highlightFuture():void {

        // NOTE: Future isn't the same as moment.utc() !!!!
        // The future is all time forward of the time at which the elements were added
        // to the timeline.

        if (!this.loadTime) {
            return;
        }

        // if end time is not in the future then hide the future highlight

        if (this.loadTime.isAfter(this.endTime)) {

            //this.future.addClass('hidden');
            this.future[0].style.display = 'none';

        } else {

            // set extents of future which defaults to the entire timeline

            var left:number = 0;

            var width:number = this.contentWidth;

            // if now is within the visible portion then adjust left edge

            if (this.loadTime.isAfter(this.startTime)) {

                left = this.whenToPixels(this.loadTime);

                width = this.contentWidth - left;
            }

            // update highlight

//            // jquery
//            this.future.css({
//                left: left,
//                width: width,
//                height: this.contentHeight,
//                display: 'block'
//            });

            // native

            var c = this.future[0].style;

            c.left = left + 'px';
            c.width = width + 'px';
            c.height = this.contentHeight + 'px';
            c.display = "block";

            // make visible

            //this.future.removeClass('hidden');
        }
    }


    /**
     * calculate best interval for time scale and display. Remove any old time scale markers
     */
    private updateTimeScale() {

        // ignore while locked or no data

        if (this.updateCount || this.empty) {
            return;
        }

        // collect the ticks mark that remain from the last call and any new ones added in 'a'
        // then replace this.timeScaleDOM with a at the end

        var a:lineAndLabel[] = [];

        // find the interval which provides steps closest to our desired target ( kINTERVAL_PIXELS )

        var interval

        var best = Number.MAX_VALUE;

        _.each(CyTimeline.timeIntervals, (j) => {

            // get pixel width for this interval, convert step in MS to pixels

            var w:number = j.step * this._spp;

            var delta:number = Math.abs(CyTimeline.kTICK_SPACING - w);

            // update ?

            if (delta < best) {

                best = delta;

                interval = j;
            }

        }, this);

        // here interval is the best time interval to use

        // display until we have passed this.endTime

        var time = interval.round(this.startTime);

        while (time.valueOf() < this.endTime.valueOf()) {

            // rounding may result in tick marks that are not visible, ignore those

            // position line

            var px = this.whenToPixels(time);

            if (px >= 0 && px < this.contentWidth) {

                // create DOM element ( or re-use existing )

                var e:lineAndLabel = {line: null, label: null};

                if (this.timeScaleDOM && this.timeScaleDOM.length) {

                    // use existing element

                    e = this.timeScaleDOM.pop();

                } else {

                    // create new line and new label

                    var e = {

                        line: $('<div class="timeline-tick"></div>'),
                        label: $('<div class="timeline-tick-label"></div>')
                    };

                    // add to DOM

                    e.line.appendTo(this.content);

                    e.label.appendTo(this.timescale);
                }

                // for performance reason these updates are completed using the native DOM API

//                // jquery version, if you run into problems
//                e.line.css({
//
//                    left: px + 'px',
//                    height: this.contentHeight + 'px'
//
//                });

                var c = e.line[0].style;

                c.left = px + 'px';

                c.height = this.contentHeight + 'px'

                // position label and format text

//                // jquery version
//                e.label.css({
//
//                    left: (px - (CyTimeline.kTICK_LABEL_WIDTH / 2)) + 'px'
//                });

                c = e.label[0].style;

                c.left = (px - (CyTimeline.kTICK_LABEL_WIDTH / 2)) + 'px';

                // format using the correct format for this interval

                // jquery
                //e.label.text(this.momentFormat(time, interval.format));

                e.label[0].textContent = this.momentFormat(time, interval.format)

                // save for later removal

                a.push(e);
            }

            // next tick mark

            interval.inc(time);
        }

        // remove any left over time scale elements

        this.removeTimeScaleElements();

        // update with new elements

        this.timeScaleDOM = a;

    }

    /**
     * remove time scale elements
     */
    private removeTimeScaleElements():void {

        while (this.timeScaleDOM && this.timeScaleDOM.length) {

            var e = this.timeScaleDOM.pop();

            e.line.remove();

            e.label.remove();
        }
    }

    /**
     * ideal spacing for tick marks. The interval closest to this is used
     */
    private static kTICK_SPACING = 200;

    /**
     * each entry gives:
     * step   - the second interval between vertical time marks,
     * inc    - add the given step to the given time, this function is more accurate than just adding 'step' seconds
     *          to a time since periods like months, years are not constants
     * format - format string used to display the time,
     * round  - a function for rounding down the start time to the nearest appropriate value
     */
    private static timeIntervals = [
        {
            // 1 second

            step: 1,
            inc: function (d:Moment) {

                d.add('seconds', 1);
            },
            format: "mm:ss",
            round: function (d:Moment):Moment {

                return moment(d);
            }
        },
        {
            // 10 seconds

            step: 10,
            inc: function (d:Moment) {

                d.add('seconds', 10);
            },
            format: "HH:mm:ss",
            round: function (d:Moment):Moment {
                return moment(d).startOf('minute').add('seconds', CyTimeline.R(d.seconds(), 10));
            }
        },
        {
            // 30 seconds

            step: 30,
            inc: function (d:Moment) {

                d.add('seconds', 30);
            },
            format: "HH:mm:ss",
            round: function (d:Moment):Moment {
                return moment(d).startOf('minute').add('seconds', CyTimeline.R(d.seconds(), 30));
            }
        },
        {
            // 1 minute

            step: 60,
            inc: function (d:Moment) {

                d.add('minutes', 1);
            },
            format: "HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('minute');
            }
        },
        {
            // 5 minute

            step: 5 * 60,
            inc: function (d:Moment) {

                d.add('minutes', 5);
            },
            format: "HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('hour').minutes(CyTimeline.R(d.minutes(), 5));
            }
        },
        {
            // 15 minutes

            step: 15 * 60,
            inc: function (d:Moment) {

                d.add('minutes', 15);
            },
            format: "HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('hour').minutes(CyTimeline.R(d.minutes(), 15));
            }
        },
        {
            // 30 minutes

            step: 30 * 60,
            inc: function (d:Moment) {

                d.add('minutes', 30);
            },
            format: "HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('hour').minutes(CyTimeline.R(d.minutes(), 30));
            }
        },
        {
            // 1 hour

            step: 60 * 60,

            inc: function (d:Moment) {

                d.add('hours', 1);
            },
            format: "M/YYYY HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('hour');
            }
        },
        {
            // 4 hour

            step: 4 * 60 * 60,

            inc: function (d:Moment) {

                d.add('hours', 4);
            },
            format: "M/YYYY HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('day').add('hours', CyTimeline.R(d.hours(), 4));
            }
        },
        {
            // 8 hour

            step: 8 * 60 * 60,

            inc: function (d:Moment) {

                d.add('hours', 8);
            },
            format: "M/YYYY HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('day').add('hours', CyTimeline.R(d.hours(), 8));
            }
        },
        {
            // 12 hour

            step: 12 * 60 * 60,
            inc: function (d:Moment) {

                d.add('hours', 12);
            },
            format: "M/YYYY HH:mm",
            round: function (d:Moment):Moment {

                return moment(d).startOf('day').add('hours', CyTimeline.R(d.hours(), 12));
            }
        },
        {
            // 24 hour

            step: 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('days', 1);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('day');
            }
        },
        {
            // 2 days

            step: 2 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('days', 2);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('month').date(CyTimeline.R(d.date() - 1, 2) + 1);
            }
        },
        {
            // 4 days

            step: 4 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('days', 4);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('month').date(CyTimeline.R(d.date() - 1, 4) + 1);
            }
        },
        {
            // week

            step: 7 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('weeks', 1);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('month').date(CyTimeline.R(d.date() - 1, 7) + 1);
            }
        },
        {
            // 2 weeks

            step: 14 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('weeks', 2);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('month').date(CyTimeline.R(d.date() - 1, 14) + 1);
            }
        },
        {
            // month

            step: 30 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('months', 1);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment().startOf('year').add('month', d.month());
            }
        },
        {
            // 2 months ( 61 days )

            step: 61 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('months', 2);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('year').month(CyTimeline.R(d.month(), 2));
            }
        },
        {
            // 4 months ( 122 days )

            step: 122 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('months', 4);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('year').month(CyTimeline.R(d.month(), 4));
            }
        },
        {
            // 8 months ( 244 days )

            step: 244 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('months', 8);
            },
            format: "M/D/YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('year').month(CyTimeline.R(d.month(), 8));
            }
        },
        {
            // 1 year

            step: 365 * 24 * 60 * 60,
            inc: function (d:Moment) {

                d.add('years', 1);
            },
            format: "YYYY",
            round: function (d:Moment):Moment {

                return moment(d).startOf('year');
            }
        }
    ];

    /**
     * round a number to the nearest multiple of w e.g. round(11,4) return 8
     * @param v
     * @param w
     */
    private static R(v:number, w:number):number {

        return Math.floor(v / w) * w;
    }

    /**
     * line and label selectors for tick marks
     */
    private timeScaleDOM:lineAndLabel[];

    /**
     * update the position and width of a bar which we assume is already added to the
     * timeline.
     * @param b
     */
    private updateBar(b:timelineElement, index:number):void {

        // ignore while locked or no data

        if (this.updateCount || this.empty || !b.element) {
            return;
        }

        // get range of bar in seconds

        var span = b.cyend.unix() - b.cystart.unix()

        // convert to pixels

        var barWidth = Math.ceil(span * this._spp);

        var left = Math.floor(this.whenToPixels(b.cystart));

        var top = this.contentHeight - ((index + 1) * (CyTimeline.kBAR_HEIGHT + CyTimeline.kBAR_PAD ) + CyTimeline.kBAR_BORDER);

        // hide bars that are not visible in the window

        if (left + barWidth < 0 || left > this.contentWidth) {

//            // jquery slow
//
//            b.element.css({
//                display: 'none'
//            });

            // native faster

            b.element[0].style.display = 'none';

        } else {

            // clamp bar such that they are never wider than the display and start at the left edge.
            // This prevents the DIV tags becoming very wide which is a performance killer on some browsers

            if (left < 0) {

                barWidth += left + 1;

                left = -1;
            }

            if (left + barWidth > this.contentWidth) {

                barWidth -= this.contentWidth - (left + barWidth);
            }

            // position bar

            // jquery...slow version
//            b.element.css({
//                top: top,
//                left: left,
//                width: barWidth,
//                display: 'block'
//            });

            // native API....

            var c = b.element[0].style;

            c.top = top + 'px';
            c.left = left + 'px';
            c.width = barWidth + 'px';
            c.display = 'block';

        }
    }

    /**
     * prevent propagation / bubbling of an event, used to prevent text selection
     * while dragging
     * @param e
     * @returns {boolean}
     */
    private pauseEvent(e):boolean {

        if (e.stopPropagation) {

            e.stopPropagation();
        }
        if (e.preventDefault) {

            e.preventDefault();
        }
        e.cancelBubble = true;

        e.returnValue = false;

        return false;
    }

    /**
     * return the pixel position of the given time
     * @param d
     */
    private whenToPixels(d:Moment):number {

        // get delta in MS

        var leftDeltaSeconds = d.valueOf() - this.startTime.valueOf();

        // mul by seconds per pixel

        return (leftDeltaSeconds / 1000) * this._spp;
    }

    /**
     * for layout must match the CSS height of .alarm-bar (@bar-height)
     */
    private static kBAR_HEIGHT = 20;

    /**
     * vertical padding between bars
     */
    private static kBAR_PAD = 4;

    /**
     * size of borders on bars
     */
    private static kBAR_BORDER = 2;

    /**
     * minimum height of content area. Matches a CSS constant/style @min-content-height
     */
    private static kMIN_CONTENT_HEIGHT = 100;

    /**
     * space between top of bars and top of window
     */
    private static kTOP_PAD = 25;


    /**
     * fixed width of tick mark labels NOTE: This is wired to a CSS value in timeline.less @tick-label-width
     */
    private static kTICK_LABEL_WIDTH = 140;

    /**
     * maps elements by ID to their respective DOM element
     */
    private barMap:timelineElement[][];

    /**
     * this is the time at the center of the timeline. It is MS in the usual Unix Epoch format.
     */
    private _centerTime:Moment;
    public get centerTime():Moment {
        return moment(this._centerTime);
    }

    public set centerTime(v:Moment) {

        // save new center time

        this._centerTime = moment(v);

        // get displayed time span

        var span = this.endTime.unix() - this.startTime.unix();

        // don't allow left edge of data set go past the right edge of the display

        if (this.endTime.valueOf() < this.minTime.valueOf()) {

            // calculate center time from end time

            this._centerTime = moment(this.minTime).subtract('seconds', span / 2);
        }

        // don't allow right edge of data set go past the left edge of the display

        if (this.startTime.valueOf() > this.maxTime.valueOf()) {

            this._centerTime = moment(this.maxTime).add('seconds', span / 2);
        }

        // redraw display

        this.updateDisplay();

        // hide tooltips when the time changes

        if (this.tooltip) {
            this.tooltip.hide();
        }

        // validate all times

        this.validate();
    }

    /**
     * get the start time ( left edge of graph )
     */
    public get startTime():Moment {

        var w:number = this.contentWidth;

        return moment(this._centerTime).subtract('seconds', (w / this._spp) / 2);

    }

    /**
     * get the end time ( right edge of graph )
     */
    public get endTime():Moment {

        var w:number = this.contentWidth;

        return moment(this._centerTime).add('seconds', (w / this._spp) / 2);
    }

    /**
     * this is 'seconds per pixel'. It is the exclusive way to control the zoom level of
     * the widget
     */
    private _spp:number;
    public get spp():number {
        return this._spp;
    }

    public set spp(v:number) {

        // clamp to limits

        this._spp = Math.max(CyTimeline.kMIN_SPP, Math.min(CyTimeline.kMAX_SPP, v));

        // redraw

        this.updateDisplay();
    }

    /**
     * max seconds per pixel...reasonable at 1 second intervals
     */
    private static kMAX_SPP:number = 100;

    /**
     * reason minimum
     */
    private static kMIN_SPP:number = 0.00000628540282396406;


    public buildElement():JQuery {

        // clone timeline from template and cache certain dimensions which are slow to calculate e.g. .width()

        this.timeline = CyTemplates.cloneTemplate('timeline');

        this.content = $('[data-element="content"]', this.timeline);

        this.slider = $('[data-element="slider"]', this.timeline);

        this.timescale = $('[data-element="time-scale"]', this.timeline);

        this.startLabel = $('[data-element="start-time"]', this.timeline);

        this.endLabel = $('[data-element="end-time"]', this.timeline);

        this.mouseLabel = $('[data-element="mouselabel"]', this.timeline)

        this.emptyLabel = $('[data-element="empty-label"]', this.content);

        this.scroller = $('[data-element="scroller"]', this.slider);

        this.thumb = $('[data-element="thumb"]', this.scroller);

        this.thumbWidth = this.thumb.width();

        this.zoomHolder = $('[data-element="zoom-holder"]', this.content);

        this.plus = $('[data-element="plus"]', this.content);

        this.minus = $('[data-element="minus"]', this.content);

        this.future = $('[data-element="future"]', this.content);

        return this.timeline;
    }

    /**
     * selectors for timeline components
     */
    private timeline:JQuery;

    private content:JQuery;

    private slider:JQuery;

    private timescale:JQuery;

    private startLabel:JQuery;

    private endLabel:JQuery;

    private mouseLabel:JQuery;

    private emptyLabel:JQuery;

    private scroller:JQuery;

    private thumb:JQuery;

    private plus:JQuery;

    private minus:JQuery;

    private zoomHolder:JQuery;

    private future:JQuery;

    /**
     * hide all bars that have the given class
     * @param cls
     */
    public hideClass(cls:string):void {

        // add if not already present

        if (this.hiddenClasses.indexOf(cls) < 0) {

            // add to hidden classes

            this.hiddenClasses.push(cls);

            // hide element with this class

            $('.' + cls, this.content).addClass('hidden');
        }
    }

    /**
     * show the class if currently hidden
     * @param cls
     */
    public showClass(cls:string):void {

        if (this.hiddenClasses.indexOf(cls) >= 0) {

            this.hiddenClasses.splice(this.hiddenClasses.indexOf(cls), 1);

            // show element with this class

            $('.' + cls, this.content).removeClass('hidden');
        }
    }

    /**
     * call after adding new bars to ensure the required classes are hidden
     */
    private updateHiddenBars():void {

        // reduce all hidden classes to single string e.g if the classes to hide are 'a' 'b' 'c' we want
        // 'a.b.c'

        $(this.hiddenClasses.join('.'), this.content).addClass('hidden');

    }

    /**
     * class names that are hiding
     */
    private hiddenClasses:string[] = [];

    /**
     * add some test data to the timeline. Useful for unit testing
     */
    public addTestData():void {

        // add some bars for testings

        var a = [];

        var start = new Date().getTime() - (24 * 60 * 60 * 1000);

        for (var i = 0; i < 10; i += 1) {

            var btime = start + i * (1000 * 60 * 60);

            var etime = btime + (3 * 60 * 60 * 1000);

            a.push({

                text: "Element: " + i + "A",
                id: "idx-" + i.toString(),
                cssclass: 'alarm-bar-critical',
                start: btime,
                end: etime

            });

            a.push({

                text: "Element: " + i + "B",
                id: "idx-" + i.toString(),
                cssclass: 'alarm-bar-major',
                start: btime + (4 * 60 * 60 * 1000),
                end: etime + (4 * 60 * 60 * 1000)

            });

            a.push({

                text: "Element: " + i + "C",
                id: "idx-" + i.toString(),
                cssclass: 'alarm-bar-minor',
                start: btime + (8 * 60 * 60 * 1000),
                end: etime + (8 * 60 * 60 * 1000)

            });

            a.push({

                text: "Element: " + i + "D",
                id: "idx-" + i.toString(),
                cssclass: 'alarm-bar-warning',
                start: btime + (12 * 60 * 60 * 1000),
                end: etime + (12 * 60 * 60 * 1000)

            });
        }

        this.addElements(a);

    }

    /**
     * perform our initial resize when added to the DOM
     */
    public addedToDOM():void {

        // perform full layout in case we are already have a data set to display

        this.resize();

        // bind mouse down/up for dragging

        this.content.bind('mousedown', $.proxy(this.mouseDown, this));

        // capture mouse up / blur on the window/document to cancel dragging
        // NOTE: This is on the document so that we capture wherever the mouse ends up

        // also bind mouseup on window to ensure we get when mouse is outside of window

        $(document).bind('mouseup', $.proxy(this.mouseUp, this));

        $(window).bind('mouseup', $.proxy(this.mouseUp, this));

        // mouse moves are detected on the document so we can can catch moves beyond an elements client area

        $(document).bind('mousemove', $.proxy(this.mouseMove, this));

        // sink mouse move on content just to update the mouse time

        this.content.bind('mousemove', $.proxy(this.updateMouseTime, this));

        // mouse mouse enters and leaves to hide / show time label

        this.content.bind('mouseenter', $.proxy(this.mouseEnter, this));

        this.content.bind('mouseleave', $.proxy(this.mouseLeave, this));

        // bind mouse wheel for time scaling zooming

        this.content.bind('mousewheel', $.proxy(this.mouseWheel, this));

        // bind mouse down/up/move on scroller for tracking it

        this.scroller.bind('mousedown', $.proxy(this.scrollerMouseDown, this));

        // bind clicks on plus/minus buttons

        this.plus.click(() => {

            this.spp *= 1.5;
        });

        this.minus.click(() => {

            this.spp *= 0.75;
        });

        // sink clicks on start / end time to run date/time picker

        this.startLabel.click(() => {

            // when updating the start of the range allow the user to pick any start time UPTO 5 minutes before
            // end of the current range and back 5 years

            var start:Moment = moment.utc(0);

            var end:Moment = moment(this.timestampToMoment(this.alarmGraph.scope.dateRange[1].getTime())).subtract('minutes', 5);

            this.eventBus.trigger('show-datetime-picker', {
                start: start.valueOf(),
                end: end.valueOf(),
                resolver: 'start' + this.UUID
            });

        });

        this.endLabel.click(() => {

            // when updating the end of the range allow the user to pick any time 5 minutes after the
            // current start time and upto now

            var start:Moment = moment(this.startTime).add('minutes', 5);

            var end:Moment = moment.utc();

            this.eventBus.trigger('show-datetime-picker', {
                start: start.valueOf(),
                end: end.valueOf(),
                resolver: 'end' + this.UUID
            });

        });

        // sink events that indicate the datetime picker is closing, for either the start or end time

        this.eventBus.on('completed-datetime-picker', (payload?:any) => {

            if (payload.resolver === 'start' + this.UUID) {

                // update owning viewer with new time range

                this.alarmGraph.updateDateRange([this.momentToDate(moment.utc(payload.when)),
                    this.alarmGraph.scope.dateRange[1]]);


            }

            if (payload.resolver === 'end' + this.UUID) {

                this.alarmGraph.updateDateRange([this.momentToDate(this.startTime),
                    this.momentToDate(moment.utc(payload.when))]);
            }
        });
    }

    /**
     * update time at mouse when mouse moves in timeline
     * @param e
     */
    private updateMouseTime(e:JQueryMouseEventObject):void {

        // calculate time at mouse position

        if (!this.empty) {

            var x:number = e.clientX - this.content.offset().left;

            this.setTimeLabel(this.momentLongFormatRelative(this.pixelToTime(x)));
        }
    }

    /**
     * set text on time label at top of screen
     * @param t
     */
    private setTimeLabel(t:string) {

        this.mouseLabel.text(t);
    }

    /**
     * mouse moves are handled at the document level and sent to the appropriate method according to drag status
     * @param e
     */
    private mouseMove(e:JQueryMouseEventObject):void {

        // main content area being dragged ?

        if (this.dragging) {

            var o = this.content.offset();

            var x = e.pageX - o.left;

            var y = e.pageY - o.top;

            this.contentMouseMove(x, y);
        }

        // scroller being dragged

        if (this.draggingThumb) {

            var o = this.scroller.offset();

            var x = e.pageX - o.left;

            var y = e.pageY - o.top;

            this.scrollerMouseMove(x, y);
        }
    }

    /**
     * mouse down in scroll
     * @param e
     */
    private scrollerMouseDown(e:JQueryMouseEventObject):boolean {

        // ignore if not left button or already dragging thumb or empty

        if ((e.which !== 1) || this.empty || this.draggingThumb) {
            return true;
        }

        // get client coordinate

        var x = e.clientX - this.scroller.offset().left;

        // test againsts limits of thumb

        var left = this.thumb.position().left;

        if (x < left || x > left + this.thumb.width()) {
            return;
        }

        // remove transition class from thumb so it immediately responsive

        this.thumb.removeClass('alarm-scroll-thumb-animate');

        // record the start position of the mouse and the thumb

        this.thumbX1 = x;

        this.thumbX2 = left;

        this.draggingThumb = true;

        // set initial velocity

        this.velocity = 0;

        // start request animation frame callbacks

        this.animate();

        return true;
    }

    /**
     * animate timeline while dragging thumb
     */
    private animate():void {

        if (this.draggingThumb) {

            // add current velocity

            this.centerTime = moment(this._centerTime).add('seconds', this.velocity);

            // ask for another callback

            window.requestAnimationFrame(this.animateProxy);
        }
    }

    /**
     * calculate the current velocity of the timeline based on the deflection of the thumb.
     * The velocity is calculated and +/- seconds. Since the animation occurs at 60fps the velocity
     * should is scaled based on the current scaling such that the maximum velocity is 2 window widths per second
     */
    private updateThumbVelocity():void {

        // get dimensions of element involved in this calulation

        var tw:number = this.thumb.width();

        var tx:number = this.thumb.position().left;

        var sw:number = this.scroller.width();

        var cw:number = this.contentWidth;

        // get pixel deflection of center of thumb from center of scroller

        var deflection:number = (sw / 2) - (tx + tw / 2);

        // normalize to -1/+1 based on width of scroller less the width of the thumb itself

        var n = deflection / ((sw - tw) / 2);

        // convert normalized value -1/+1 to seconds where 1 is equal to 1/60th of the timeline width in seconds

        var secondsWide:number = cw / this.spp;

        // set velocity ( assuming 60fps )

        this.velocity = (secondsWide * 2) / 60 * n;
    }

    /**
     * timeline velocity in seconds per frame while dragging the thumb
     */
    private velocity:number;

    /**
     * proxy for animate function
     */
    private animateProxy:any = $.proxy(this.animate, this);

    /**
     * true when dragging scroller thumb
     */
    private draggingThumb:boolean = false;

    /**
     * start position of mouse and thumb during a thumb drag
     */
    private thumbX1:number;

    private thumbX2:number


    /**
     * mouse move in scroller
     * @param e
     */
    private scrollerMouseMove(x:number, y:number):void {

        if (this.draggingThumb) {

            // get offset from start position

            var offset = this.thumbX1 - x;

            // get new position for thumb and clamp

            var tx = this.thumbX2 - offset;

            var sw = this.scroller.width() + 2;

            tx = Math.floor(Math.max(-1, Math.min(sw - this.thumb.width(), tx)));

            // position thumb

//            this.thumb.css({
//                left: tx
//            });

            this.thumb[0].style.left = tx + 'px';

            // update velocity of timeline

            this.updateThumbVelocity();

        }
    }

    /**
     * end dragging of thumb
     */
    private endThumbDrag():void {

        if (this.draggingThumb) {

            // end drag and animate thumb back to position. We have to add the CSS class
            // at leave it in place otherwise the transitions won't occur

            this.draggingThumb = false;

            this.thumb.addClass('alarm-scroll-thumb-animate');

            _.delay($.proxy(function () {

                this.centerThumb();

            }, this), 1);

        }
    }

    /**
     * handle mouse enters
     * @param e
     */
    private mouseEnter(e:JQueryMouseEventObject):void {

        // show the time span label if not empty

        if (!this.empty) {
            this.mouseLabel.removeClass('hidden');
        }
    }

    /**
     * mouse leave events
     */
    private mouseLeave(e:JQueryMouseEventObject):void {

        this.mouseLabel.addClass('hidden');

    }

    /**
     * handler for mouse release, this should be attached to the document to ensure we get the release
     * when mouse is release outside of client area. It is also attached to the blur event so we
     * handle loss of focus as mouse up
     * @param e
     */
    private mouseUp(e:JQueryMouseEventObject):void {

        if ((e.which === 1) && (this.dragging || this.draggingThumb || this.selecting)) {

            this.dragging = false;

            this.endSelection();

            this.endThumbDrag();
        }

    }

    /**
     * mouse wheel event
     * @param e
     */
    private mouseWheel(e:any) {

        // ignore if empty

        if (this.empty) {
            return;
        }

        // limit normalized y delta to -100/+100

        if (e.deltaY !== 0 && e.shiftKey) {

            // get time at mouse position, we want to restore this position to the same x position after changing the scale.
            // Thus the user can zoom in/out on the mouse location

            var x = e.clientX - this.content.offset().left;

            var start:Moment = this.pixelToTime(x);

            // zoom in / out

            var y = Math.max(-100, Math.min(100, e.deltaY));

            this.spp = this.spp * (y > 0 ? 1.1 : 0.9);

            // now we now the delta between the mouse position/time before scaling we can adjust the start time
            // of the time accordingly

            var end:Moment = this.pixelToTime(x);

            this.centerTime = moment.utc(this.centerTime.valueOf() + (start.valueOf() - end.valueOf()));

            // don't let event propagate

            e.preventDefault();

            e.stopPropagation();

            // hide tooltips

            if (this.tooltip) {
                this.tooltip.hide();
            }
        }
    }

    /**
     * mouse down handler
     * @param e
     */
    private mouseDown(e:JQueryMouseEventObject):boolean {

        // ignore if not left button

        if (e.which !== 1) {
            return;
        }

        // start a drag or select if not already doing so

        if (!this.dragging) {

            this.dragging = true;

            // true if selecting a time range

            this.selecting = e.shiftKey;

            // record starting point and starting center time

            this.dx = e.clientX - this.content.offset().left;

            this.ex = this.dx;

            this.dt = moment(this.centerTime);

            this.validate();

            // update selection rectangle

            this.updateSelection();

        }

        return true;

    }

    /**
     * mouse move handler for main content area
     * @param e
     */
    private contentMouseMove(x:number, y:number):void {

        // ignore if empty

        if (this.empty) {
            return;
        }


        // calculate time at mouse position and display

        this.setTimeLabel(this.momentLongFormat(this.pixelToTime(x)));

        // dragging if mouse down

        if (this.dragging) {

            if (this.selecting) {

                // update selection

                this.ex = x;

                this.updateSelection();

                // replace time label with time range of selection

                var s1:Moment = this.pixelToTime(Math.min(this.dx, this.ex));

                var s2:Moment = this.pixelToTime(Math.max(this.dx, this.ex));

                this.setTimeLabel(this.momentLongFormat(s1) + " - " + this.momentLongFormat(s2));

            } else {

                // get delta from starting position and convert to seconds

                var deltaSeconds = (this.dx - x) / this.spp;

                // set new center time

                this.centerTime = moment(this.dt).add('seconds', deltaSeconds);

                this.validate();

            }
        }

        this.validate();
    }

    /**
     * return long format of a datetime using moment to format
     * @param t
     */
    private momentLongFormat(t:Moment):string {

        return this.momentFormat(t, "dddd, MMMM Do YYYY, HH:mm:ss");

    }

    /**
     * return long format date/time + relative time ( UTC )
     * @param t
     */
    private momentLongFormatRelative(t:Moment):string {

        var basic:string = this.momentFormat(t, "dddd, MMMM Do YYYY, HH:mm:ss");

        return basic + ' ( ' + t.from(moment.utc()) + ' )';
    }

    /**
     * format with moment string
     * @param t
     */
    private momentFormat(t:Moment, s:string):string {

        // set unix MS value to use a secondary index into cache

        var v:number = t.valueOf();

        // get cache for this format

        var c:Object = this.momentFormatCache[s];

        // create as required

        if (!c) {
            c = this.momentFormatCache[s] = {};
        }

        // get cached time format for this string

        var r:string = c[v];

        // if not cached then create and store in cache and return value for function

        if (!r) {

            r = c[v] = t.format(s);
        }

        return r;
    }

    /**
     * used to cache formatted date objects using the valueOf() property as a the key
     */
    private momentFormatCache:Object = {};

    /**
     * reset the thumb position to the center
     */
    private centerThumb():void {

        var sw:number = this.scroller.width();

        var tw:number = this.thumb.width();

        this.thumb.css({
            left: Math.round((sw - tw) / 2)
        });
    }

    /**
     * update selection rectangle, creating and adding to DOM as necessary
     */
    private updateSelection():void {

        if (this.selecting) {

            // create rectangle as required

            if (!this.selectionRect) {

                this.selectionRect = $('<div class="timeline-selection"></div>');

                this.selectionRect.appendTo(this.content);
            }

            // calculate bounds

            var w:number = Math.abs(this.ex - this.dx);

            var l:number = Math.min(this.dx, this.ex);

            var h:number = this.contentHeight;

            // update

            this.selectionRect.css({
                left: l,
                width: w,
                height: h
            });
        }
    }

    /**
     * selection rect if any
     */
    private selectionRect:JQuery;

    /**
     * end the selection process and update timeline to selecting time range
     */
    private endSelection():void {

        // remove rectangle if selecting and update range

        if (this.selecting) {

            this.selecting = false;

            this.selectionRect.remove();

            this.selectionRect = null;

            // update display to selected range

            this.beginUpdate();

            // calculate selected span

            var start:Moment = this.pixelToTime(Math.min(this.dx, this.ex));

            var end:Moment = this.pixelToTime(Math.max(this.dx, this.ex));

            // get delta in MS

            var span:number = end.valueOf() - start.valueOf();

            // set scale

            this.spp = this.contentWidth / (span / 1000);

            // set center time to the mid point

            this.centerTime = start.add('seconds', (span / 1000) / 2);

            // redraw

            this.endUpdate();
        }
    }

    /**
     * convert horizontal pixel location to date/time
     * @param x
     * @returns {Moment}
     */
    private pixelToTime(x:number):Moment {

        return moment(this.startTime).add('seconds', x / this.spp);
    }

    /**
     * true when dragging with the mouse
     */
    private dragging:boolean = false;

    /**
     * true when dragging AND selecting a time range ( shift key held )
     */
    private selecting:boolean = false;

    /**
     * mouse position at start of drag
     */
    private dx:number;

    /**
     * mouse position during drag
     */
    private ex:number;

    /**
     * center time at start of drag
     */
    private dt:Moment;

    /**
     * cleanup
     */
    public dispose():void {

        // now base class, which cleans up all CyWidgets and remove all, including
        // non cyan elements from the DOM

        super.dispose();
    }
}

export = CyTimeline;
