define([
    'ui/window/cy-affected-services-window',
    'util/cy-templates',
    'ui/component/cy-widget'
], function (CyAffectedServicesWindow, CyTemplates, CyWidget) {

    describe("CyAffectedServicesWindow", function () {

        var window;
        var masterContent;

        // i18n options

        var option = {
            resGetPath: '/nms/i18n/__lng__/__ns__.json',
            ns: {
                namespaces: [ 'translation', 'cyms' ],
                defaultNs: 'translation'
            },
            fallbackLng: 'en',
            cookieName: 'cy.i18n',
            keyseparator: '|'
        };

        var testData = [
            {
                "customer": null,
                "trail_type": 0,
                "last_sync_status": "NA",
                "trail_type_name": "Discovered",
                "name": "OTS:HW31:LINE_FAC-1-6-1<->HW32:LINE_FAC-1-6-1",
                "admin_state_name": "Unlocked",
                "__name": "nw_trail",
                "service_state": 0,
                "service_state_name": "In-Service",
                "last_transition": "TRANSITION_NONE",
                "provision_state": "PROVISIONED",
                "a_end_info": "HW32:LINE_FAC-1-6-1",
                "z_end_info": "HW31:LINE_FAC-1-6-1",
                "admin_state": 1,
                "static_protection_level_name": "Unprotected",
                "owner": "",
                "layer_rate_name": "OTS",
                "static_protection_level": 1,
                "user_label": "",
                "layer_rate": 42
            },
            {
                "customer": null,
                "trail_type": 0,
                "last_sync_status": "NA",
                "trail_type_name": "Discovered",
                "name": "Optical:HW31:LINE_FAC-1-6-1<->HW32:LINE_FAC-1-6-1",
                "admin_state_name": "Unlocked",
                "__name": "nw_trail",
                "service_state": 0,
                "service_state_name": "In-Service",
                "last_transition": "TRANSITION_NONE",
                "provision_state": "PROVISIONED",
                "a_end_info": "HW32:LINE_FAC-1-6-1",
                "z_end_info": "HW31:LINE_FAC-1-6-1",
                "admin_state": 1,
                "static_protection_level_name": "Unprotected",
                "owner": "",
                "layer_rate_name": "Optical",
                "static_protection_level": 1,
                "user_label": "",
                "layer_rate": 47
            }
        ];


        beforeEach(function (done) {

            $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;

            $.mockjax({
                url: "/api/v1/trails/affected",
                responseText: JSON.stringify({
                    "count": 1,
                    "index": 0,
                    "last": false,
                    "__name": "page",
                    "objects": testData
                })
            });


            $(document).bind('DOMNodeInserted', function (e) {

                // let the widget class figure it all out based on the type of the widget

                CyWidget.DOMNodeInserted($(e.target));
            });

            // this is needed to ensure the window class has a valid section to append to
            // since it inherently appends to .master-page-body for all window types
            masterContent = $('<div class="master-page-body"></div>');
            masterContent.appendTo($('body'));

            $.i18n.init(option, function () {
                CyTemplates.loadTemplate('main.html', function () {
                    window = new CyAffectedServicesWindow();
                    done();
                });
            });

        });

        afterEach(function () {

            window.close();
            masterContent.remove();
            $.mockjaxClear();

        });

        it("minWidth and minHeight should be set properly", function (done) {

            var options = window.kWindow.options;

            expect(options.minWidth).to.equal(650);
            expect(options.minHeight).to.equal(230);

            done();
        });


    });
});