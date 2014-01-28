define(['ui/component/cy-timeline', 'ui/component/cy-widget', 'util/cy-templates' ], function (CyTimeline, CyWidget, CyTemplates) {

  describe("CyTimeline", function () {
    var body = $('body')
      , container = null
      , timeline = null;


    /**
     * build up
     */
    beforeEach(function (done) {

      CyTemplates.loadTemplate('master.html', function () {

        // create empty container for timeline

        container = $('<div></div>').appendTo(body);

        // create timeline and append to container

        timeline = new CyTimeline();

        timeline.element.appendTo(container);

        // explicity call addedToDOM since this will only be called as part of the CyApp framework

        timeline.addedToDOM();

        done();

      });
    });

    /**
     * tear down
     */
    afterEach(function (done) {

      if (container) {

        CyWidget.disposeTree(timeline.element);

        container.remove();
      }

      timeline = null;

      container = null;

      done();

    });

    describe('should be able to', function () {

      // ---------------------------------------------------------------------------------------------------------------

      it('create a timeline from constructor', function (done) {

        assert.isDefinedAndNotNull(timeline, 'Timeline is null or not defined');

        done();

      });

      // ---------------------------------------------------------------------------------------------------------------

      it('create a timeline and display the "No Alarms" label', function (done) {

        assert.isDefinedAndNotNull(timeline, 'Timeline is null or not defined');

        var label = $('[data-element="empty-label"]', timeline.element);

        assert(label.length === 1, 'Expected to find the label');

        // should NOT have the class 'hidden'

        assert(!label.hasClass('hidden'), 'Expected label to be visible');

        done();

      });

      // ---------------------------------------------------------------------------------------------------------------

      it('create a timeline and add some test data and render the bars', function (done) {

        assert.isDefinedAndNotNull(timeline, 'Timeline is null or not defined');

        // add some test data

        timeline.addTestData();

        // the resize / update handler is debounced...ensure it is actually called

        timeline._resize();

        // test that the timeline has mutated based on that data

        var label = $('[data-element="empty-label"]', timeline.element);

        assert(label.length === 1, 'Expected to find the label');

        // SHOULD have the class 'hidden'

        assert(label.hasClass('hidden'), 'Expected label to be hidden');

        // verify timescale and scroller area and other sundry widgets are all visible

        var scale = $('[data-element="time-scale"]', timeline.element);

        assert(!scale.hasClass('hidden'), 'Expected scale to be visible');

        var slider = $('[data-element="slider"]', timeline.element);

        assert(!slider.hasClass('hidden'), 'Expected slider to be visible');

        // we expect there to be 40 total bars and 10 rows, with 1 of each type

        var a = [
          {
            css  : '.alarm-bar',
            total: 40
          },
          {
            css  : '.alarm-bar-critical',
            total: 10
          },
          {
            css  : '.alarm-bar-major',
            total: 10
          },
          {
            css  : '.alarm-bar-minor',
            total: 10
          },
          {
            css  : '.alarm-bar-warning',
            total: 10
          }
        ];

        for (var i = 0; i < a.length; i += 1) {

          var bars = $(a[i].css, timeline.element);

          assert(bars.length === a[i].total, "Incorrect number of bars of class:" + a[i].css);

          // ensure width is greater than zero and has the correct display class ( to indicate it is not
          // clipped from the display )

          bars.each(function (i, b) {

            assert($(b).width() > 0, "Bar Width is <= 0");

            var display = $(b).css('display');

            assert(display === 'block', "Expect the bar to be block versus:" + display);

          });
        }

        done();

      });

      // ---------------------------------------------------------------------------------------------------------------

      it('create a timeline and add some test data and test the zoom functionality', function (done) {

        assert.isDefinedAndNotNull(timeline, 'Timeline is null or not defined');

        // add some test data

        timeline.addTestData();

        // the resize / update handler is debounced...ensure it is actually called

        timeline._resize();

        // get plus / minus buttons

        plus = $('[data-element="plus"]', timeline.element);

        minus = $('[data-element="minus"]', timeline.element);

        // get current scale

        var spp = timeline.spp;

        // trigger zoom in

        plus.trigger('click');

        // verify spp is greater i.e. more seconds per pixels

        assert(timeline.spp > spp, "Expected timeline to zoom in:" + spp + ", " + timeline.spp);

        // trigger zoom out x 2

        minus.trigger('click');

        minus.trigger('click');

        // verify spp is now less seconds per pixel than before

        assert(timeline.spp < spp, "Expected timeline to zoom out:" + spp + ", " + timeline.spp);

        done();

      });

      // ---------------------------------------------------------------------------------------------------------------

      it('create a timeline and add some test data and test the scrolling functionality', function (done) {

        assert.isDefinedAndNotNull(timeline, 'Timeline is null or not defined');

        // add some test data

        timeline.addTestData();

        // the resize / update handler is debounced...ensure it is actually called

        timeline._resize();

        // save the position of each bar in a data property attached to element

        var bars = $('.alarm-bar', timeline.element);

        assert(bars.length === 40, "Where are the bars?");

        // ensure width is greater than zero and has the correct display class ( to indicate it is not
        // clipped from the display )

        bars.each(function (i, b) {

          $(b).data('saved-left', $(b).css('left'));

        });

        // get text/html associated wit start / end time labels

        var start = $('[data-element="start-time"]', timeline.element).html().toString();

        var end = $('[data-element="end-time"]', timeline.element).html().toString();

        // advance center time by 15 minutes

        timeline.centerTime = timeline.centerTime = moment(timeline.centerTime).add('minutes', 15);

        // verify each bar has moved to the left

        bars = $('.alarm-bar', timeline.element);

        assert(bars.length === 40, "Where are the bars now?");

        // ensure width is greater than zero and has the correct display class ( to indicate it is not
        // clipped from the display )

        bars.each(function (i, b) {

          var oldLeft = parseInt($(b).data('saved-left'));

          var newLeft = parseInt($(b).css('left'));

          assert(newLeft < oldLeft, "Expected bars to move to the left");

        });

        // assert time labels changed

        assert($('[data-element="start-time"]', timeline.element).html().toString() !== start, "Expected start time to change");

        assert($('[data-element="end-time"]', timeline.element).html().toString() !== end, "Expected end time to change");

        done();

      });

      // -------------------------------------------------------------------------------------------------------------

    });
  });
});

