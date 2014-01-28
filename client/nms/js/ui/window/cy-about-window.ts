/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyWindow = require("./cy-window");
import CyTemplate = require("../../util/cy-templates");

/**
 * Displays a nice little about box for OperateWeb
 */
class CyAboutWindow extends CyWindow {

    constructor() {
        super({
            width: 400,
            height: 300,
            resizable: false,
            title: "About OperateWeb"
        });

        var template = CyTemplate.cloneTemplate("cyan-about-box");
        template.appendTo(this.clientArea);

        this.center();
    }
}

export = CyAboutWindow;
