/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

import CyApp = require('../../cy-app');
import CyTemplates = require('../../util/cy-templates');
import CyEvents = require('../../cy-events');
import CyUtils = require('../../util/cy-utils');
import CyView = require('./cy-view');
import CyAnalyticsGrid = require('../grid/cy-analytics-grid');
import CyGrid = require('../grid/cy-grid');
import CyAnalyticsToolbar = require('../toolbar/cy-analytics-toolbar');

/**
 * this is view within the app class. It has nothing to do with the model-view paradigm
 */
class CyAnalyticsView extends CyView {

    constructor() {

        // super first as required

        super("CyAnalyticsView");

        // show navigation headers relative to this view

        CyApp.I.showNavigationHeaders();

    }

    /**
     * initialize view after getting the signed in user
     */
    public buildElement():JQuery {


        // setup event handler

        this.eventTokens = new CyEvents.EventIDList(CyApp.I.eventBus);

        // handle browser resize events

        this.eventTokens[CyApp.kBROWSER_RESIZED] = CyApp.I.eventBus.on(CyApp.kBROWSER_RESIZED, () => {

            if (this._analyticsGrid) {

                this._analyticsGrid.setGridHeight(CyTemplates.content.height() - 40);
            }
        });

        // setup grid

        this._analyticsGrid = new CyAnalyticsGrid();

        this._analyticsGrid.setGridHeight(CyTemplates.content.height() - 40);

        this._analyticsGrid.toolbar = new CyAnalyticsToolbar();

        // return the analytics grid element as our only element

        return this._analyticsGrid.element;
    }

    /**
     * size grid when first added to DOM
     */
    public addedToDOM() : void {

        this._analyticsGrid.setGridHeight(CyTemplates.content.height() - 40);

        // since the analytics grid element is now the view element, the grid's addedToDOM method will not get called.

        this._analyticsGrid.addedToDOM();
    }

    /**
     * event token manager
     */
    private eventTokens:CyEvents.EventIDList;


    /**
     * dispose the view
     */
    public dispose():void {

        // unsink browser events

        if (this.eventTokens) {
            this.eventTokens.allOff();
        }

    }

    private _analyticsGrid:CyAnalyticsGrid;
}

export = CyAnalyticsView

