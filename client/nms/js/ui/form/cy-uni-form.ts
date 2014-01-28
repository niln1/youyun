/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyForm = require("./cy-form");
import CyTemplates = require("../../util/cy-templates");
import CyNodeSelector = require("../window/cy-node-selector");
import CyPortsSelector = require("../window/cy-ports-selector");
import CyWindow = require("../window/cy-window");
import CyDialog = require("../window/cy-dialog");

/**
 * Form class that handles UNI configuration
 * @class CyUNIForm
 */
class CyUNIForm extends CyForm {

    constructor() {
        super("CyUNIForm");
    }

    /**
     * build components
     * @method buildElement
     * @returns {JQuery}
     * @public
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate('uni-config-template');

        // register mvvm for the template

        this.registerBindings(e);

        return e;
    }

    /**
     * Registers a model with the DOM
     * @method registerBindings
     * @param e
     * @private
     */
    private registerBindings(e:JQuery) : void {

        this.viewModel = kendo.observable({
            node: "",
            port: "",
            browseNodes: $.proxy(this.browseNodes, this),
            browsePorts: $.proxy(this.browsePorts, this)
        });

        kendo.bind(e, this.viewModel);
    }

    /**
     * Opens the node browser
     * @returns {boolean}
     * @private
     */
    private browseNodes(e:JQueryEventObject) : any {

        if (!this.nodeSelector) {

            // create node selector with single select

            this.nodeSelector = new CyNodeSelector(false);
            this.nodeSelector.on(CyWindow.kEVENT_CLOSING, $.proxy(this.onNodeSelectorClosed, this));
        }

        // prevent default submit on click
        e.preventDefault();
    }

    /**
     * Opens the ports browser
     * @method browsePorts
     * @private
     */
    private browsePorts(e:JQueryEventObject) : any {

        var node = this.viewModel.get('node');

        if (!node) {
            CyDialog.messageDialog("Information", "You must first select a node");
        } else {

            if (!this.portsSelector) {

                // create ports selector with single select

                this.portsSelector = new CyPortsSelector(node, false);
                this.portsSelector.on(CyWindow.kEVENT_CLOSING, $.proxy(this.onPortsSelectorClosed, this));

            }
        }

        // prevent default submit on click
        e.preventDefault();
    }

    /**
     * Update the view model with the node selection when the window is closed
     * @method onNodeSelectorClosed
     * @param e
     * @private
     */
    private onNodeSelectorClosed(e?:any) {

        if (this.nodeSelector.modalResult == CyDialog.kMODAL_OK) {
            var nodeSelected = this.nodeSelector.selections[0];
            this.viewModel.set('node', nodeSelected.user_label)
        }
        this.nodeSelector = null;
    }

    /**
     * Update the view model with the port selection
     * @method onPortsSelectorClosed
     * @param e
     * @private
     */
    private onPortsSelectorClosed(e?:any) {

        if (this.portsSelector.modalResult == CyDialog.kMODAL_OK) {
            var portSelected = this.portsSelector.selections[0];
            this.viewModel.set('port', portSelected.name);
        }
        this.portsSelector = null;
    }

    /**
     * override form member
     * @returns {null}
     * @public
     */
    public get formData() : any {

        return null;
    }

    /**
     * node selector window
     * @type CyNodeSelector
     * @private
     */
    private nodeSelector : CyNodeSelector;

    /**
     * ports selector window
     * @type CyPortsSelector
     * @private
     */
    private portsSelector : CyPortsSelector;

    /**
     * view model for the form
     * @type kendo.data.ObservableObject
     * @private
     */
    private viewModel : kendo.data.ObservableObject;
}

export = CyUNIForm;