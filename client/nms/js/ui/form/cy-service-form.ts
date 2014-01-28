/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyApp = require("../../cy-app");
import CyForm = require("./cy-form");
import CyTemplates = require("../../util/cy-templates");
import CyEndpointForm = require("./cy-endpoint-form");
import CySplitter = require("../component/cy-splitter");
import CyServiceConnector = require("../../data/connectors/cy-service-connector");
import CyServiceTemplateConnector = require("../../data/connectors/cy-service-template-connector");
import CyServiceModel = require("../../data/models/cy-service-model");

/**
 * interface for configuring new endpoint forms
 */
interface EndpointConfigInterface {
    position: number;   // zero-based index
    definition: any;    // configuration that gets passed to the endpoint forms
}

/**
 * interface that defines the list of forms needed for a service type
 */
interface ServiceConfigInterface {
    a: EndpointConfigInterface;
    z?: EndpointConfigInterface;
}

/**
 * instance of the service config interface that gets used in creation of the forms
 */
var eplServiceConfig = {
    a: {
        position: 0,
        definition: {
            classes: {
                "UNI": {
                    multipleFlows: false
                },
                "E-NNI": {

                }
            }
        }
    },
    z: {
        position: 1,
        definition: {
            classes: {
                "UNI": {
                    multipleFlows: false

                },
                "E-NNI": {

                }
            }
        }

    }
}

var evplServiceConfig = {
    a: {
        position: 0,
        definition: {
            classes: {
                "UNI": {
                    multipleFlows: true
                },
                "E-NNI": {

                }
            }
        }
    },
    z: {
        position: 1,
        definition: {
            classes: {
                "UNI": {
                    multipleFlows: true

                },
                "E-NNI": {

                }
            }
        }
    }
}

/**
 * @class CyServiceForm
 */
class CyServiceForm extends CyForm {

    /**
     * Constructs a new service form or populate with existing service
     * @class CyServiceForm
     * @param service the service object
     * @constructor
     */
    constructor(service?:any) {

        super("CyServiceForm");

        if (service) {
            this.serviceModel = new CyServiceModel(service.toJSON());
        }
    }

    /**
     * build for components
     * @method buildElement
     * @returns {JQuery}
     */
    public buildElement() : JQuery {

        var e = CyTemplates.cloneTemplate('new-service-form-template');
        e.css('position', 'absolute');
        e.css('overflow', 'auto');
        e.css('width', '100%');
        this.configForms = [];

        // initializes the data sources
        this.initializeSources();

        // setup drop downs for main service parameters
        this.serviceTypeList = $('#service-type-list', e).kendoDropDownList({
            dataTextField: 'text',
            dataValueField: 'value',
            dataSource: this.serviceTemplateConnector.dataSource,
            change: $.proxy(this.onServiceTypeChange, this)
        }).data('kendoDropDownList');

        this.oamProfileList = $('.oam-profile-list', e).kendoDropDownList().data('kendoDropDownList');
        this.customerList = $('.customer-list', e).kendoDropDownList().data('kendoDropDownList');
        this.providerProfileList = $('.provider-profile-list', e).kendoDropDownList().data('kendoDropDownList');

        // register mvvm bindings
        this.registerBindings(e);

        // populate with existing data if present
        this.getServiceDetail();

        return e;
    }

    /**
     * Initializes all the datasources we need for the drop-down widgets
     */
    private initializeSources() {

        // initialize the data source used for service type drop down list
        this.serviceTemplateConnector = new CyServiceTemplateConnector();
        this.serviceTemplateConnector.customOptions = {
            schema: {
                // generates a data source for the service type drop down
                parse: function (response:any):any {
                    var serviceTypeList = [];

                    serviceTypeList.push({
                        text: 'Select Type',
                        value: 'Select Type'
                    });

                    _.each(response.objects, function (element) {
                        serviceTypeList.push({
                            text: element.service_name,
                            value: element.service_name
                        });
                    });

                    return serviceTypeList;
                }
            }
        };
    }

    /**
     * Register all form elements with the view model
     * @param e
     */
    private registerBindings(e:JQuery) {

        this.modelTemplate = {
            serviceType: 'Select Type',
            owner: "",
            circuitId: "",
            description: "",
            oamProfile: "Select Profile",
            customer: "Select Customer",
            providerProfile: "Select Profile",
            ethcsf: false,
            evcllf: false
        };

        this.viewModel = kendo.observable(this.modelTemplate);
        kendo.bind(e, this.viewModel);
    }

    /**
     * Setups the data source necessary to fetch a specific service and calls initialize to populate the forms with
     * this data
     * @method getServiceDetail
     */
    private getServiceDetail() {
        if (this.serviceModel) {
            this.setOtherForms(this.serviceModel.data.used_template, this.serviceModel);

            // update form
            this.updateServiceDetails();

            // build out the forms
        }
    }

    /**
     * Updates the global service details for this form.  This is the top most form controls
     */
    private updateServiceDetails() {
        var globalParams = this.serviceModel.getGlobalParameters();

        this.viewModel.set('serviceType', globalParams.used_template);
        this.viewModel.set('circuitId', globalParams.circuit_id);
        this.viewModel.set('description', globalParams.description);
        this.viewModel.set('owner', globalParams.owner);
        this.viewModel.set('oamProfile', globalParams.supplied_parameters.global_oam_profile);
        this.viewModel.set('ethcsf', globalParams.supplied_parameters.global_oam_csf);
        this.viewModel.set('evcllf', globalParams.supplied_parameters.global_oam_llf);
    }

    /**
     * Called when the service type list changes
     * @param e
     */
    private onServiceTypeChange(e?:any) {
        this.setOtherForms(this.serviceTypeList.value());
    }

    /**
     * Sets the current form for the service type
     * @method setConfigForm
     * @param serviceType
     */
    private setOtherForms(serviceType : string, data?:any) {

        this.clearOtherForms();
        var options = this.getServiceOptions(serviceType);
        if (!options) return;

        var endPointTable:JQuery = CyTemplates.cloneTemplate('cyan-service-azends-config-template');
        endPointTable.addClass('azends-table');
        if (options.a) {
            this.configForms[0] = new CyEndpointForm(options.a.definition, data);
            this.configForms[0].element.appendTo($(".a-end", endPointTable))
        }
        if (options.z) {
            this.configForms[1] = new CyEndpointForm(options.z.definition, data);
            this.configForms[1].element.appendTo($(".z-end", endPointTable))
        }
        endPointTable.appendTo(this.element)
    }

    /**
     * Get service options necessary for building out the right forms for a particular service type.
     * @param serviceType
     * @returns {ServiceConfigInterface}
     */
    private getServiceOptions(serviceType) : ServiceConfigInterface {

        var options : ServiceConfigInterface = null;

        switch (serviceType) {
            case "P2P EPL": {
                options = eplServiceConfig;
            }
               break;
            case "P2P EVPL": {
                options = evplServiceConfig;
            }
        }

        return options;
    }

    /**
     * Clears all views from the splitter
     */
    private clearOtherForms() {
        var aztable:JQuery = $('.azends-table', this.element);
        aztable.remove();
    }

    /**
     * overridden member of form
     * @returns {null}
     * @public
     */
    public get formData() : any {
        return null;
    }

    /**
     * service type dropdown widget
     * @type kendo.ui.DropDownList
     */
    private serviceTypeList : kendo.ui.DropDownList;

    /**
     * oam profile list dropdown widget
     * @type kendo.ui.DropDownList
     */
    private oamProfileList : kendo.ui.DropDownList;

    /**
     * customer list dropdown widget
     * @type kendo.ui.DropDownList
     */
    private customerList : kendo.ui.DropDownList;

    /**
     * provider profile list dropdown widget
     * @type kendo.ui.DropDownList
     */
    private providerProfileList : kendo.ui.DropDownList;

    /**
     * service data model
     * @type number
     * @private
     */
    private serviceModel : CyServiceModel;

    /**
     * service template api data source
     * @type kendo.data.DataSource
     */
    private serviceTemplateConnector : CyServiceTemplateConnector;

    /**
     * list of endpoint forms
     * @type CyEndpointForm
     */
    private configForms : CyEndpointForm[];

    /**
     * form view model
     * @type kendo.data.ObservableObject
     */
    private viewModel : kendo.data.ObservableObject;

    /**
     * A private member
     * @type any
     */
    private modelTemplate: any;
}

export = CyServiceForm;