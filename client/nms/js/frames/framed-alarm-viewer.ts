/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/kendo.web.d.ts" />
/// <reference path="../definitions/underscore.d.ts" />
/// <reference path="../definitions/i18next.d.ts" />

import CyAlarm = require("../ui/component/cy-alarm-viewer");
import CyIFrameMessenger = require("../cy-iframe-messenger");
import CyTemplates = require("../util/cy-templates");
import CyWidget = require("../ui/component/cy-widget");

/**
 * start the application/page
 */
$(document).ready(() => {

    // initialize the i18n system

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

    $(document).bind('DOMNodeInserted', (e:JQueryEventObject) => {

        // let the widget class figure it all out based on the type of the widget

        CyWidget.DOMNodeInserted($(e.target));
    });

    // further initialization occurs after i18n is initialized

    $.i18n.init(option, () => {


        CyTemplates.loadTemplate("frames/framed-alarm-viewer.html", function () {

            var viewer = new CyAlarm.CyAlarmViewer();

            viewer.eventBus = CyIFrameMessenger.I;

            viewer.element.appendTo($('body'));


            viewer.resize();

            viewer.initializeFromSettings();

            $(window).on('resize', function () {
                viewer.resize();
            });
        });

    });


});