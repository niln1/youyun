define( [ 'cy-events' ], function (CyEvents) {

    var eventManager = null;
    var inputBox = null;



    // helper method for testing subscribers.
    // if handler is provided, test that the handler matches the subscriber callback
    function testSubscribers(em, id, handler) {

        var msg = em.idToMessage[id];

        if (handler) {
            should.exist(msg);
            should.exist(msg.subscriptions[id]);
            expect(msg.subscriptions[id].callback).to.equal(handler);
        } else {
            should.not.exist(msg);
        }
    }


    describe("CyEventManager", function () {

        beforeEach(function () {

            // start with new event manager for each test

            eventManager = new CyEvents.CyEventManager();
        });

        // adding event handlers

        it("can add an (on) event handler to the subscriber list", function () {

            var handler = function (e) {

            };
            var id = eventManager.on('test_event', handler);

            testSubscribers(eventManager, id, handler);

        });

        it("can add a (once) event handler to the subscriber list", function () {

            var handler = function (e) {

            };
            var id = eventManager.once('test_event', handler);

            testSubscribers(eventManager, id, handler);
        });

        it("can add an (all) event handler to the subscriber list", function () {

            var handler = function (e) {

            };
            var id = eventManager.all(handler);

            testSubscribers(eventManager, id, handler);
        });


        // removing event handlers

        it("can remove an (on) event handler from the subscriber list", function () {

            var handler = function (e) {

            };
            var id = eventManager.on('test_event', handler);

            testSubscribers(eventManager, id, handler);

            eventManager.off(id);

            testSubscribers(eventManager, id, null);
        });

        it("can remove a (once) event handler from the subscriber list", function () {

            var handler = function (e) {

            };
            var id = eventManager.on('test_event', handler);

            testSubscribers(eventManager, id, handler);

            eventManager.off(id);

            testSubscribers(eventManager, id, null);

        });

        it("can remove an (all) event handler from the subscriber list", function () {
            var handler = function (e) {

            };
            var id = eventManager.all(handler);

            testSubscribers(eventManager, id, handler);

            eventManager.off(id);

            testSubscribers(eventManager, id, null);
        });


        // triggering event handlers

        it("can invoke all (on) event handlers", function () {

            var callback = sinon.spy();

            eventManager.on('test_event', callback);

            eventManager.trigger('test_event');

            expect(callback.called).to.equal(true);

        });

        it("can invoke all (once) event handlers once and only once per subscriber", function () {

            var callback = sinon.spy();

            eventManager.once('test_event', callback);

            eventManager.trigger('test_event');
            eventManager.trigger('test_event');

            expect(callback.calledOnce).to.equal(true);

        });

        it("can invoke all (all) event handlers", function () {

            var callback = sinon.spy();

            eventManager.all(callback);

            eventManager.trigger('test_event');

            expect(callback.called).to.equal(true);

        });

    });

    describe("EventIDList", function () {

        beforeEach(function () {

            // start with new event manager for each test

            eventManager = new CyEvents.CyEventManager();
        });

        it("can add and event token", function () {

            var idList = new CyEvents.EventIDList(eventManager);
            var handler = function (e) {

            };

            var id = eventManager.on('test_event', handler);
            idList.add(id);

            expect(idList.list).to.have.length(1);

        });

        it("can remove all subscribers from the event manager", function () {
            var idList = new CyEvents.EventIDList(eventManager);

            var handler = function (e) {

            };

            var id = eventManager.on('test_event', handler);
            idList.add(id);

            idList.allOff();

            testSubscribers(eventManager, id, null);
        });
    });

});