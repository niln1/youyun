define(['ui/component/cy-splitter', 'cy-events', 'cy-app', 'util/cy-templates'], function (CySplitter, CyEvents, CyApp, CyTemplates) {
    describe("CySplitter", function () {
        var body        = $('body')
          , container   = null
          , rootView    = null;

        CyApp.I = {};
        CyApp.I.eventBus = new CyEvents.CyEventManager()

        beforeEach(function (done) {
            CyTemplates.loadTemplate('master.html', function () {
                container = $('<div></div>').appendTo(body);
                rootView  = new CySplitter(this, null, container, 'root');
                done();
            });
        });

        afterEach(function (done) {
            if (rootView)  rootView.destroy();
            if (container) container.empty().remove();
            rootView  = null;
            container = null;
            done();
        });

        describe('should be able to', function () {
            it('create a split view from constructor', function (done) {
                assert.isDefinedAndNotNull(rootView, 'rootView is null or not defined');
                done();
            });

            it('create a split view from JSON', function (done) {
                if (rootView)  rootView.destroy();
                rootView  = null;
                container.empty();

                var testJSON = {
                    name: 'window',
                    orientation: 'horizontal',
                    children: [
                        {
                            name: 'left',
                            orientation: 'vertical',
                            children: [
                                {
                                    name: 'left-1',
                                    orientation: 'vertical'
                                }, {
                                    name: 'left-2',
                                    orientation: 'vertical'
                                }
                            ], options: [
                            null,
                            null
                        ]
                        }, {
                            name: 'right',
                            orientation: 'horizontal'
                        }
                    ], options: [
                        null,
                        null
                    ]
                };

                rootView = CySplitter.splitViewFromJSON(this, container, testJSON);

                assert.isDefinedAndNotNull(rootView, 'rootView is null or not defined');
                assert.isDefinedAndNotNull(rootView.name);
                assert.equal(rootView.name, 'window');
                assert.isDefinedAndNotNull(rootView.orientation);
                assert.equal(rootView.orientation, 'horizontal');

                assert.lengthOf(rootView.children, 2);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[1]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.isDefinedAndNotNull(rootView.children[1].name);
                assert.equal(rootView.children[0].name, 'left');
                assert.equal(rootView.children[1].name, 'right');
                var leftView = rootView.children[0];
                var rightView = rootView.children[1];
                assert.isDefinedAndNotNull(leftView.orientation);
                assert.equal(leftView.orientation, 'vertical');
                assert.isDefinedAndNotNull(rightView.orientation);
                assert.equal(rightView.orientation, 'horizontal');

                assert.lengthOf(leftView.children, 2);
                assert.isDefinedAndNotNull(leftView.children[0]);
                assert.isDefinedAndNotNull(leftView.children[1]);
                assert.isDefinedAndNotNull(leftView.children[0].name);
                assert.isDefinedAndNotNull(leftView.children[1].name);
                assert.equal(leftView.children[0].name, 'left-1');
                assert.equal(leftView.children[1].name, 'left-2');
                assert.isDefinedAndNotNull(leftView.children[0].orientation);
                assert.equal(leftView.children[0].orientation, 'vertical');
                assert.isDefinedAndNotNull(leftView.children[1].orientation);
                assert.equal(leftView.children[1].orientation, 'vertical');

                assert.lengthOf(rightView.children, 0);

                done();
            });

            it('append new views', function(done) {
                assert.lengthOf(rootView.children, 0);

                rootView.append('subview-0');
                assert.lengthOf(rootView.children, 1);
                assert.isDefinedAndNotNull(rootView.children[0]);
                var view0 = rootView.children[0];
                assert.isDefinedAndNotNull(view0.name);
                assert.equal(view0.name, 'subview-0');

                rootView.append('subview-1');
                assert.lengthOf(rootView.children, 2);
                assert.isDefinedAndNotNull(rootView.children[1]);
                var view1 = rootView.children[1];
                assert.isDefinedAndNotNull(view1.name);
                assert.equal(view1.name, 'subview-1');

                view0.append('subview-00');
                assert.lengthOf(view0.children, 1);
                assert.isDefinedAndNotNull(view0.children[0]);
                assert.isDefinedAndNotNull(view0.children[0].name);
                assert.equal(view0.children[0].name, 'subview-00');

                view0.append('subview-01');
                assert.lengthOf(view0.children, 2);
                assert.isDefinedAndNotNull(view0.children[1]);
                assert.isDefinedAndNotNull(view0.children[1].name);
                assert.equal(view0.children[1].name, 'subview-01');

                view1.append('subview-10');
                assert.lengthOf(view1.children, 1);
                assert.isDefinedAndNotNull(view1.children[0]);
                assert.isDefinedAndNotNull(view1.children[0].name);
                assert.equal(view1.children[0].name, 'subview-10');

                view1.append('subview-11');
                assert.lengthOf(view1.children, 2);
                assert.isDefinedAndNotNull(view1.children[1]);
                assert.isDefinedAndNotNull(view1.children[1].name);
                assert.equal(view1.children[1].name, 'subview-11');

                done();
            });

            it('insert view before valid index', function (done) {
                assert.lengthOf(rootView.children, 0);

                try {
                    rootView.insertBefore(0, '0');
                    done('should throw an exception for invalid index');
                } catch (e) {
                    assert.isDefinedAndNotNull(e);
                }

                rootView.append('0');
                rootView.append('1');

                assert.lengthOf(rootView.children, 2);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[1]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.isDefinedAndNotNull(rootView.children[1].name);
                assert.equal(rootView.children[0].name, "0");
                assert.equal(rootView.children[1].name, "1");

                rootView.insertBefore(0, '2');
                assert.lengthOf(rootView.children, 3);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[1]);
                assert.isDefinedAndNotNull(rootView.children[2]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.isDefinedAndNotNull(rootView.children[1].name);
                assert.isDefinedAndNotNull(rootView.children[2].name);
                assert.equal(rootView.children[0].name, "2");
                assert.equal(rootView.children[1].name, "0");
                assert.equal(rootView.children[2].name, "1");

                done();
            });

            it('insert view after valid index', function (done) {
                assert.lengthOf(rootView.children, 0);

                try {
                    rootView.insertAfter(0, '0');
                    done('should throw an exception for invalid index');
                } catch (e) {
                    assert.isDefinedAndNotNull(e);
                }

                rootView.append('0');
                rootView.append('1');
                assert.lengthOf(rootView.children, 2);

                rootView.insertAfter(0, '2');
                assert.lengthOf(rootView.children, 3);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[1]);
                assert.isDefinedAndNotNull(rootView.children[2]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.isDefinedAndNotNull(rootView.children[1].name);
                assert.isDefinedAndNotNull(rootView.children[2].name);
                assert.equal(rootView.children[0].name, "0");
                assert.equal(rootView.children[1].name, "2");
                assert.equal(rootView.children[2].name, "1");

                rootView.insertAfter(2, '3');
                assert.lengthOf(rootView.children, 4);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[1]);
                assert.isDefinedAndNotNull(rootView.children[2]);
                assert.isDefinedAndNotNull(rootView.children[3]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.isDefinedAndNotNull(rootView.children[1].name);
                assert.isDefinedAndNotNull(rootView.children[2].name);
                assert.isDefinedAndNotNull(rootView.children[3].name);
                assert.equal(rootView.children[0].name, "0");
                assert.equal(rootView.children[1].name, "2");
                assert.equal(rootView.children[2].name, "1");
                assert.equal(rootView.children[3].name, "3");

                done();
            });

            it('remove view at valid index', function (done) {
                assert.lengthOf(rootView.children, 0);

                try {
                    rootView.remove(0);
                    done('should throw an exception for invalid index');
                } catch (e) {
                    assert.isDefinedAndNotNull(e);
                }

                rootView.append('0');
                rootView.append('1');
                rootView.append('2');
                assert.lengthOf(rootView.children, 3);

                try {
                    rootView.remove(3);
                    done('should throw an exception for invalid index');
                } catch (e) {
                    assert.isDefinedAndNotNull(e);
                }

                rootView.remove(2);
                assert.lengthOf(rootView.children, 2);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[1]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.isDefinedAndNotNull(rootView.children[1].name);
                assert.equal(rootView.children[0].name, "0");
                assert.equal(rootView.children[1].name, "1");

                rootView.remove(1);
                assert.lengthOf(rootView.children, 1);
                assert.isDefinedAndNotNull(rootView.children[0]);
                assert.isDefinedAndNotNull(rootView.children[0].name);
                assert.equal(rootView.children[0].name, "0");

                rootView.remove(0);
                assert.lengthOf(rootView.children, 0);
                assert.isNull(rootView.splitDiv);

                done();
            });

            it('remove all views', function (done) {
                assert.lengthOf(rootView.children, 0);

                rootView.removeAll();
                assert.lengthOf(rootView.children, 0);

                rootView.append('0');
                rootView.append('1');
                rootView.append('2');
                assert.lengthOf(rootView.children, 3);
                rootView.removeAll();
                assert.lengthOf(rootView.children, 0);
                assert.isNull(rootView.splitDiv);

                rootView.append('0');
                rootView.children[0].append('00');
                rootView.removeAll();
                assert.lengthOf(rootView.children, 0);
                assert.isNull(rootView.splitDiv);

                done();
            });

            it('set name of the view', function (done) {
                assert.isDefinedAndNotNull(rootView.name);
                assert.equal(rootView.name, 'root');
                rootView.setName('window');
                assert.equal(rootView.name, 'window');

                done();
            });

            it('set orientation of the view', function (done) {
                rootView.append();
                rootView.append();

                assert.isDefinedAndNotNull(rootView.orientation);
                assert.equal(rootView.orientation, 'horizontal');
                rootView.setOrientation('horizontal');
                assert.equal(rootView.orientation, 'horizontal');
                rootView.setOrientation('vertical');
                assert.equal(rootView.orientation, 'vertical');

                done();
            });

            it('toggle orientation of the view', function (done) {
                rootView.append();
                rootView.append();

                assert.isDefinedAndNotNull(rootView.orientation);
                assert.equal(rootView.orientation, 'horizontal');
                rootView.toggleOrientation();
                assert.equal(rootView.orientation, 'vertical');

                done();
            });
        });

        describe('should throw an exception', function () {
            
        });
    });
});