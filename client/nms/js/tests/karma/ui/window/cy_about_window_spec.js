define([
    'ui/window/cy-about-window',
    'util/cy-templates'
], function (CyAboutWindow, CyTemplates) {

    describe("CyAboutWindow", function () {

        var aboutWindow;
        var masterContent;

        beforeEach(function (done) {

            // this is needed to ensure the window class has a valid section to append to
            // since it inherently appends to .master-page-body for all window types
            masterContent = $('<div class="master-page-body"></div>');
            masterContent.appendTo($('body'));

            CyTemplates.loadTemplate('main.html', function () {
                aboutWindow = new CyAboutWindow();
                done();
            });
        });


        afterEach(function () {

            aboutWindow.close();
            masterContent.remove();
        });

        it("should display a version and copyright", function () {

            var container = aboutWindow.clientArea.find(".about-container");

            expect(container.find(":contains('Version')").length, "contains a version").to.equal(1);
            expect(container.find(":contains('Copyright')").length, "contains copyright").to.equal(1);
        });
    });
});