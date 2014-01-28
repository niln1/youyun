/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/kendo.web.d.ts" />
/// <reference path="../definitions/underscore.d.ts" />
/// <reference path="../definitions/i18next.d.ts" />

import CyAlarmLogGrid = require("../ui/grid/cy-alarm-log-grid");
import CyIFrameMessenger = require("../cy-iframe-messenger");
import CyTemplates = require("../util/cy-templates");
import CyGridComboToolbar = require("../ui/toolbar/cy-grid-combo-toolbar");
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

        CyTemplates.loadTemplate("frames/framed-log-grid.html", function () {
            // grid options

            var options:kendo.ui.GridOptions = {
                selectable: "multiple, row"
            };

            // create node grid as our content ement

            var g = new CyAlarmLogGrid(options);

            g.eventBus = CyIFrameMessenger.I;

            g.element.appendTo($('body'));

            g.setGridHeight($(window).height());

            g.toolbar = new CyGridComboToolbar('alarm-log', ['filter', 'copy-to-clipboard', 'viewer']);

            $(window).on('resize', function () {
                g.setGridHeight($(window).height());
            });
        });
    });

});