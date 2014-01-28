/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />

import CyWidget = require("../component/cy-widget");

/**
 * Views are a particular UI configuration with a single page. That are inserted into the content area
 * of the page below the header.
 */
class View extends CyWidget {

    /**
     * default constructor
     *
     * @constructor View
     */
        constructor(className) {

        // base class

        super(className);
    }

    /**
     * chain dispose methods
     */
    public dispose() {

    }
}

export = CyWidget;
