/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/kendo.web.d.ts" />
/// <reference path="../definitions/underscore.d.ts" />
/// <reference path="../definitions/i18next.d.ts" />

import CyTemplates = require("../util/cy-templates");

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

    // further initialization occurs after i18n is initialized

    $.i18n.init(option, () => {

        CyTemplates.loadTemplate("frames/frames.html", function () {
            CyTemplates.cloneTemplate('frames-content').appendTo($('body'));
        });

    });
});