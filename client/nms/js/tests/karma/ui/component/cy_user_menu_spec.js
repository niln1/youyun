define([
    'ui/component/cy-user-menu',
    'util/cy-templates',
    'cy-message'
], function (CyUserMenu, CyTemplates, CyMessage) {

    describe("CyUserMenu", function () {

        var container;
        var userMenu;

        beforeEach(function (done) {

            container = $("<div></div>").appendTo($('body'));

            CyTemplates.loadTemplate('main.html', function () {
                userMenu = new CyUserMenu([ {
                    user_id: 1,
                    user_name: "admin"
                }]);

                userMenu.element.appendTo(container);
                done();
            });


        });

        afterEach(function (done) {

            container.remove();
            done();
        });

        it("should have a menu link that represents the users user_name", function () {

            var menulink = container.find(".cyan-user-menu>span");

            expect(menulink.eq(0).text()).to.equal("admin");
        });

        it("should open the menu panel when responding to a click", function (done) {

            var menu = container.find(".cyan-user-menu");
            var menuPanel = container.find("ul.menu-panel");

            menu.click();

            // allow enough time for menuPanel to appear
            setTimeout(function () {
                expect(menuPanel.is(":visible")).to.equal(true);
                done();
            }, 1);
        });

        it("should trigger events for each item in the menu", function () {

            var menu = container.find(".cyan-user-menu");
            var spy = sinon.spy();

            var menuItems = menu.find("li");

            userMenu.on(CyMessage.kUSER_MENU_ITEM_SELECTED, spy);

            menuItems.each(function () {
                $(this).click();
            });

            expect(spy.callCount).to.equal(menuItems.length);

        });

        it("should close the panel when each item in the menu is clicked", function () {
            var menu = container.find(".cyan-user-menu");
            var menuPanel = container.find("ul.menu-panel");

            var menuItems = menu.find("li");

            userMenu.on(CyMessage.kUSER_MENU_ITEM_SELECTED, function () {
                expect(menuPanel.is(":visible")).to.equal(false);
            });

            menuItems.each(function () {
                menu.click();

                // allow enough time for the menuPanel to appear first
                setTimeout(function () {
                    $(this).click();
                }, 1);
            });

        });

        it("should have about menu item", function () {
            var menu = container.find(".cyan-user-menu");

            expect(menu.find("[data-item=user-menu-about]").length).to.equal(1);
        });

        it("should have sign out menu item", function () {
            var menu = container.find(".cyan-user-menu");

            expect(menu.find("[data-item=user-menu-signout]").length).to.equal(1);

        });

    });
});