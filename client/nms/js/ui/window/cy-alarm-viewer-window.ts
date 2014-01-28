/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/i18next.d.ts" />
/// <reference path="../interface/i-cy-window.d.ts" />

import CyWindow = require("./cy-window");
import CyWidget = require("../component/cy-widget");

/**
 * the window wrapper around the actual node nodegrid
 */
class CyAlarmViewerWindow extends CyWindow {

    constructor() {

        super({
            width    : 1000,
            height   : 500,
            minWidth : 745,
            minHeight: 200,
            maxWidth : 2048,
            maxHeight: 2048,
            title    : $.t("MainMenu|WindowMenu|AlarmViewerWindow")
        });

        // center in browser window for now

        this.center();

//        this._alarmViewer = new CyAlarm.CyAlarmViewer(false);
//
//        this._alarmViewer.element.appendTo(this.clientArea);

        this.on(CyWindow.kEVENT_RESIZED, () => {

            //this._alarmViewer.resize();

        });

        this.once(CyWindow.kEVENT_CLOSING, () => {

            //CyWidget.disposeTree(this._alarmViewer.element);

        });
    }

    /**
     * add the given nodes to the viewer
     * @param list
     */
    public addNodes(list:any[]) : void {

        //this._alarmViewer.addNodes(list);

    }

    public addNodesById(list:any[]) : void {

        //this._alarmViewer.addNodesById(list);

    }

    /**
     * return identifying information about the alarm viewer
     * @returns {{displayName: string, windowType: string}}
     */
    public get info () : ICyWindowInfo {

        return {
            displayName : "Alarm Viewer",
            windowType  : CyAlarmViewerWindow.kALARM_VIEWER_WINDOW_TYPE
        }
    }

    /**
     * used to uniquely identify node windows to the node manager
     * @type {string}
     */
    public static kALARM_VIEWER_WINDOW_TYPE:string = "Alarm-Viewer-Window";

    //private _alarmViewer:CyAlarm.CyAlarmViewer;
    //public get alarmViewer() : CyAlarm.CyAlarmViewer { return this._alarmViewer; }
}

export = CyAlarmViewerWindow;
