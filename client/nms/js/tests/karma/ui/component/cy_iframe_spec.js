define([ 'ui/component/cy-iframe', 'ui/component/cy-widget', 'util/cy-templates' ], function (CyIFrame, CyWidget, CyTemplates) {

    describe("CyIFrame", function () {

        var iframe;

        beforeEach(function (done) {
            CyTemplates.loadTemplate('main.html', function () {

                iframe = new CyIFrame();
                iframe.element.appendTo($('body'));

                done();
            });
        });

        afterEach(function (done) {

            CyWidget.disposeTree(iframe.element);

            window.removeEventListener('message');
            done();
        });

        it("should build an iframe element in the DOM", function () {

            expect($('iframe')).to.have.length(1);
        });

        it("should accept src and css options", function () {

            // get rid of default iframe instance

            CyWidget.disposeTree(iframe.element);

            iframe = new CyIFrame('/static/html/frames/test-frame', { width: '400'});
            iframe.element.appendTo($('body'));

            expect(iframe.src).to.equal('/static/html/frames/test-frame');
            expect(iframe.element.width()).to.equal(400);
        });

        it("can return the window object for the iframe", function () {

            var iframeWindow = $('iframe')[0].contentWindow;
            expect(iframe.contentWindow).to.equal(iframeWindow);
        });

        it("can set the src attribute of the iframe element", function (done) {

            iframe.src = '/static/html/frames/test-frame.html';

            iframe.element.load(function () {

                expect(iframe.src).to.match(/static\/html\/frames\/test-frame.html/);
                done();
            });
        });

        it("can send message directly to the iframe window", function (done) {

            iframe.src = "/static/html/frames/test-frame.html";

            iframe.element.load(function () {

                iframe.sendMessage('test', { sender: 'me', test: 'test'});
            });

            window.addEventListener('message', function (e) {

                var data = JSON.parse(e.data);
                var event = data.event;
                var payload = data.payload;

                if (event.match(/iframe/))
                    return;

                expect(event).to.equal('test');
                done();

            });


        });

        it("should trim events that have nested non-primitive types", function (done) {

            var called = 0;

            iframe.src = "/static/html/frames/test-frame.html";

            window.addEventListener('message', function (e) {
                var data = JSON.parse(e.data);
                var event = data.event;

                if (event.match(/test/) && !('payload' in data)) {
                    called++;
                }
            });

            iframe.element.load(function () {

                iframe.sendMessage('test', { sender: 'me', test: {}});
                setTimeout(function () {
                    expect(called).to.equal(0);
                    done();
                }, 500);
            });

        });
    });
});