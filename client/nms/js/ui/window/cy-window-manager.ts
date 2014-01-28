/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CyUtils = require('../../util/cy-utils');
import CyTemplates = require('../../util/cy-templates');
import CyWindow = require('./cy-window');

/**
 * very simple window manager. Keeps a list of open windows for now
 */
class CyWindowManager {

    /**
     * singleton instance for the app class. Access via the I() public/static method
     */
    private static instance:CyWindowManager;

    /**
     * singleton accessor for instance of class
     * @returns {CyWindowManager}
     * @constructor
     */
    public static get I():CyWindowManager {

        if (!CyWindowManager.instance) {

            CyWindowManager.instance = new CyWindowManager();
        }

        return CyWindowManager.instance;
    }

    /**
     * make constructor private so you must use the singleton accessor
     */
    private constructor() {

    }

    /**
     * windows we are currently managing
     * @type {Array}
     */
    private windows:CyWindow[] = [];

    /**
     * add a window to the manager
     * @param w
     */
    public addWindow(w:CyWindow) : void {

        CyUtils.assert(this.windows.indexOf(w) < 0, "Window is already managed");

        this.windows.push(w);
    }

    /**
     * remove a window from the manager
     * @param w
     */
    public removeWindow(w:CyWindow) : void {

        CyUtils.assert(this.windows.indexOf(w) >= 0, "Window not managed");

        this.windows.splice(this.windows.indexOf(w), 1);
    }

    /**
     * return a list of all windows that indicate the given type ( via their info method ).
     * If no type is specified all windows are returned
     * @param t
     */
    // TODO: Return type is any! If we make CyWindow[] we get a compile error TS2065:...which is BS in this context
    public getWindowsOfType(t?:string) : any[] {

        var list:CyWindow[] = [];

        _.each(this.windows, (window) => {

            if (!t || window.info.windowType === t) {
                list.push(window);
            }
        });

        return list;
    }
}

export = CyWindowManager