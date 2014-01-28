import CyWidget = require("./cy-widget");

/**
 * The purpose of this class is to test CyWidget by extending it with typescript.
 */

class CyWidgetTest extends CyWidget {

    constructor() {
        super("CyWidgetTest");
    }
}

export = CyWidgetTest;