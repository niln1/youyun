/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyWidget = require("../component/cy-widget");
import CyUtils = require("../../util/cy-utils");
import CyMessage = require("../../cy-message");
import CyConnector = require("../../data/connectors/cy-connector");

/**
 * Base class for all forms
 * @class CyForm
 */
class CyForm extends CyWidget {

    constructor(className : string) {
        super(className);
    }

    /**
     * Override to provide useful form validation
     * @param {any} formData
     * @returns {boolean}
     * @public
     */
    public validate(formData : any) : boolean {

        return true;
    }

    /**
     * Override to provide useful data for submission
     * @returns {{}}
     * @public
     */
    public get formData() : any {

        CyUtils.assert(false, "CyForm.formData must be overridden");
        return {};
    }

    /**
     * Connector properties
     */
    private _connector : CyConnector;

    public get connector() : CyConnector {
        return this._connector;
    }

    public set connector(value : CyConnector) {
        this._connector = value;
        this._connector.eventBus = this.eventBus;
    }


}

export = CyForm;