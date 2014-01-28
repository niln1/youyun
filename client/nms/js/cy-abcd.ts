/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />

///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2006-2013 by Cyan Optics Inc.                               //
// All rights reserved.                                                      //
//   ____                     ___        _   _                               //
//  / ___|   _  __ _ _ __    / _ \ _ __ | |_(_) ___ ___                      //
// | |  | | | |/ _` | '_ \  | | | | '_ \| __| |/ __/ __|                     //
// | |__| |_| | (_| | | | | | |_| | |_) | |_| | (__\__ \                     //
//  \____\__, |\__,_|_| |_|  \___/| .__/ \__|_|\___|___/                     //
//       |___/                    |_|                                        //
// PROPRIETARY NOTICE                                                        //
// This Software consists of confidential information.                       //
// Trade secret law and copyright law protect this Software.                 //
// The above notice of copyright on this Software does not indicate          //
// any actual or intended publication of such Software.                      //
///////////////////////////////////////////////////////////////////////////////

/* Disclaimer:
 * Current implementation in this files depends on markup in 
 * /public/html/abcd/createform.html and it may stop work if
 * markup is changed. In general it's not a very good way, but ...
 * no one cares..
*/ 

///////////////////////////////////////////////////////////////////////////////
//  _                            _                                           //
// (_)_ __ ___  _ __   ___  _ __| |_ ___                                     //
// | | '_ ` _ \| '_ \ / _ \| '__| __/ __|                                    //
// | | | | | | | |_) | (_) | |  | |_\__ \                                    //
// |_|_| |_| |_| .__/ \___/|_|   \__|___/                                    //
//             |_|                                                           //
///////////////////////////////////////////////////////////////////////////////

//import CyApp = require("./cy-app");
import CyTemplates = require("./util/cy-templates");
import CyNodeSSF = require("./cy-nodessf");
import CyDirectConnectors = require("./data/connectors/cy-direct-connectors");
import CyNodeSelector = require("./ui/window/cy-node-selector");
import CyPortSelector = require("./ui/window/cy-ports-selector");

import CyClientApi = require("./cy-clientapi");
import CyWindow = require("./ui/window/cy-window");
import CyDialog = require("./ui/window/cy-dialog");


///////////////////////////////////////////////////////////////////////////////
//                     _              _                                      //
//  ___ ___  _ __  ___| |_ __ _ _ __ | |_ ___                                //
// / __/ _ \| '_ \/ __| __/ _` | '_ \| __/ __|                               //
//| (_| (_) | | | \__ \ || (_| | | | | |_\__ \                               //
// \___\___/|_| |_|___/\__\__,_|_| |_|\__|___/                               //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export var gridSelectorWorking:string = "#grid_working";
export var gridSelectorProtected:string = "#grid_protected";
export var bandwidth_chkbx = "#bandwidth";
export var bandwidth_selector = "select.bandwidth-select";
export var manual_assign_id_chkbx = "#assign_id";
export var verify_id_btn = "button.assign-id-btn";
export var add_new_hop_link = "a.addnewhop";
export var details_table_selector = "table.details";

var TESI_LayerRate = 10000;
var ROW_HEIGHT = 26;

// Static Protection Levels
export var UNPROTECTED = 1;
export var PARTIALLY_PROTECTED = 2;
export var FULLY_PROTECTED = 3;

// TransportProvisioningStates
var PROVISIONING = 5;
var PROVISIONED = 7;

var INVALID_VALUE_BG = "rgb(238, 206, 211)";
var VALID_VALUE_BG = "white";

///////////////////////////////////////////////////////////////////////////////
//      _                     _       __ _       _ _   _                     //
//  ___| | __ _ ___ ___    __| | ___ / _(_)_ __ (_) |_(_) ___  _ __  ___     //
// / __| |/ _` / __/ __|  / _` |/ _ \ |_| | '_ \| | __| |/ _ \| '_ \/ __|    //
//| (__| | (_| \__ \__ \ | (_| |  __/  _| | | | | | |_| | (_) | | | \__ \    //
// \___|_|\__,_|___/___/  \__,_|\___|_| |_|_| |_|_|\__|_|\___/|_| |_|___/    //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface IHop{
    nextNodeName: string;
    egressTpName: string;
    ingressTpName: string;    
    ethernetTrailName: string;
}

// Interface for path table row data
export interface IPathRow{
    node;
    ingress_port;
    egress_port;
    trail;
    hops: IHop[]; // stores list of next hops
}

// Base editor for table cells
class BaseCellEditor{
    
    pathtable;
    options;
    field: string;
    container;
    rowIdx: number;
    autocomplete;
    input: JQuery;
    prefix: string = " ";
    node;
    
    _hop_to_row = {node: 'nextNodeName',
                  egress_port: 'egressTpName',
                  ingress_port: 'ingressTpName',
                  trail: 'ethernetTrailName'
                 };
    
    constructor(rowIdx: number, pathtable, container, options){
        //here we go
        this.rowIdx = rowIdx;
        this.pathtable = pathtable;
        this.node = this.pathtable.rows_data[rowIdx].node;
        this.container = container;
        this.options = options;
        this.field = options.field;
    }
    
    // this function actually creates the editor
    create(){
        var input = $("<input id='selecteditem' width='95%' />");
        input.attr("name", this.options.field);
        input.appendTo(this.container);
        this.input = input;
        
        this.autocomplete = input.kendoAutoComplete({
            dataSource: []
        }).data("kendoAutoComplete");
        
        this.populateSuggestions();
        
        var current_value = this.pathtable.grid.dataSource.data()[this.rowIdx][this.field];
       
        //this.pathtable.grid.dataSource.data()[this.rowIdx][this.field] = this.prefix;
        this.autocomplete.search(this.prefix);
        
        input.keyup(()=>{
            if (this.input.val() == ''){
                this.input.val(this.prefix);
                this.autocomplete.search(this.prefix);
            }
        });
        
        input.change(()=>{
            var val = this.input.val();
            var row_data = this.pathtable.rows_data[this.rowIdx];
            row_data[this.field] = {name: val};
            this.value_changed_cb(val);
        });
    }
    
    getRowData():IPathRow{
        return this.pathtable.rows_data[this.rowIdx];
    }
        
    getPrevRowData():IPathRow{
        if (this.rowIdx == 0){
            throw "Can't get previous row data for first row";
        }
        return this.pathtable.rows_data[this.rowIdx - 1];
    }
    
    getActualRowData():IPathRow{
        var row_data;
        if (this.pathtable.isManuallyAddedHop(this.rowIdx)){
            row_data = this.getPrevRowData();
        }
        else{
            row_data = this.getRowData();
        }
        return row_data;
    }
    
    value_changed_cb(value){
        var hop = this.getSelectedHop(value);
        var hop_index: number;
        if (this.pathtable.isManuallyAddedHop(this.rowIdx)){
            hop_index = this.rowIdx - 1;
        } else {
            hop_index = this.rowIdx;
        };
        this.pathtable.setNextHop(hop, hop_index);
    }
        
    getSelectedHop(value: string):IHop{
        value = value.trim();
        var row_data = this.getActualRowData();
        for (var i in row_data.hops){
            var hop = row_data.hops[i];
            if (value == hop[this._hop_to_row[this.field]]){
                return hop;
            }
        }
        // we don't find appropriate hop for this value
        // set value to empty string
        return null;
    }
    
    populateSuggestions(){

        var row_data = this.getActualRowData();
        var data = [];
        var unique_values = []
        
            
        for (var i in row_data.hops){
            var hop = row_data.hops[i];
            var val = hop[this._hop_to_row[this.field]];
            if (this.pathtable.isManuallyAddedHop(this.rowIdx) && this.field != "node"){
                var node = this.getRowData().node;
                if (node.user_label != hop.nextNodeName){
                    continue;
                }
            }
            if (val.indexOf(this.prefix) != 0){
                    val = this.prefix + val;
            }
            if (unique_values.indexOf(val) == -1){
                data.push(val);
                // adding the space is trick for autocomplete kendo UI
                unique_values.push(val);
            }
        }
        
        this.autocomplete.dataSource.data(data);
    }
}


class IngressPortEditor extends BaseCellEditor{
    prefix: string = "FAC-";
}


class EgressPortEditor extends BaseCellEditor{
    prefix: string = "FAC-";
}


class TrailEditor extends BaseCellEditor{
}


class NodeEditor extends BaseCellEditor{
            
    value_changed_cb(value){
        // here value should be obligatory
        var node_name = value.trim();
        this.pathtable.rows_data[this.rowIdx].node = {user_label: node_name};
    }
}

// This class should help to validate form
class ValidateHelper{
    fields;
    form;
    final_callback;
    
    constructor(form, callback){
        this.form = form;
        this.fields = [];
        this.final_callback = callback;
        for (var k in form.fields){
            this.fields.push(form.fields[k]);
        }
    }
    
    validate(){
        this.recursive_validate();
    }

    recursive_validate(){
        if (this.fields.length){
            var field = this.fields.pop();
            field.validator(field, ()=>this.recursive_validate());
        }
        else{
            var is_valid = true;
            for (var k in this.form.fields){
                var field = this.form.fields[k];
                if (field['error']){
                    is_valid = false;
                    break;
                }
            }
            this.form.is_valid = is_valid;
            this.final_callback(this.form);
        }
    }
}


export class TunnelDetailsForm{
    // FIXME: I may look better, just need to be refactored a bit
    // This is my Frankenstein, just one useful note:
    // (f, c)=>{c()} - normally means skipping of validation
    form: JQuery;
    fields = {
        trailName: {value: '', el: null, selector: ".tunnel_name", validator: (f, c)=>this.validateName(f, c)},
        owner: {value: '', el: null, selector: ".owner", validator: null},
        layerRate: {value: TESI_LayerRate, el: null, selector: null, validator: (f, c)=>{c()}}, // TODO: make me generic in future
        comment: {value: '', el: null, selector: ".comment", validator: null},
        customer: {value: '', el: null, selector: ".customer", validator: null},
        protectionScheme: {value: UNPROTECTED, el: null, selector: ".protecting_level", validator: (f, c)=>this.validateInt(f, c)},
        bvidProtecting: {value: -1, el: null, selector: ".bvidProtecting", validator: (f, c)=>{c()}},
        bvidbvidWorking: {value: -1, el: null, selector: ".bvidbvidWorking", validator: (f, c)=>{c()}},
        aEndMAC: {value: 0, el: null, selector: ".aEndMAC", validator: (f, c)=>{c()}},
        zEndMAC: {value: 0, el: null, selector: ".zEndMAC", validator: (f, c)=>{c()}}
    }
    is_valid: boolean = false;
    
    constructor(){
        
        this.form = $(details_table_selector);
        for (var k in this.fields){
            var field = this.fields[k];
            field.el = this.form.find(field.selector);
            if (!field.validator){
                field.validator = (f, c)=>this.defaultValidator(f, c);
            }
        }
        
        this.bind_events();
    }
    
    bind_events(){
        var trailNameEl: JQuery;
        trailNameEl = this.fields.trailName.el;
        trailNameEl.change(()=>this.validateName(this.fields.trailName, function(){}));
    }
    
    validate(callback){
        var helper = new ValidateHelper(this, callback);
        helper.validate();
    }
    
    validateName(field, callback){

        var name_el = this.fields.trailName.el;
        var name = name_el.val();
        if (name == ''){
            field.el.css({background: INVALID_VALUE_BG});
            field['error'] = true;
            field['errmessage'] = "Name is obligatory here";
            callback();
            return;
        }
        CyClientApi.make_request("/api/object/routeRequest",
            "is_valid_trail_name",
            (response)=>{
                if (response.validity){
                    field['error'] = false;
                    field.el.css({background: VALID_VALUE_BG});
                } else{
                    // probably should add some error message here
                    field.el.css({background: INVALID_VALUE_BG});
                    field['error'] = true;
                    field['errmessage'] = response.message; 
                }                
                callback();
            },
            {
                validtrailnameinput: {
                    "__name": "route_validtrailnameinput",
                    layerRate: this.getLayerRate(),
                    trailName: name
                }
            }
        )
        field.value = name;

    }
    
    validateInt(field, callback){
        if (field.el){
            field.value = parseInt(field.el.val());
        } // else just don't change value
        
        callback();
    }
    
    defaultValidator(field, callback){
        if (field.el){
            field.value = field.el.val();
        } // else just don't change value
        
        callback();
    }
    
    // just to incapsulate this value
    getLayerRate(){
        return this.fields.layerRate.value;
    }
    
    getProtectionScheme(){
        var el:JQuery = this.fields.protectionScheme.el;
        return parseInt(el.val());
    }
    
    // returns objects with tunnel details 
    getValues(){
        var retval = {};
        for (var k in this.fields){
            var field = this.fields[k];
            retval[k] = field.value;
        }
        return retval;
    }
}


/* This manages tables on the page */
export class TablesManager{

    working_table:PathTable;
    protected_table:PathTable;
    protection: number; // protection level
    reset_btn: JQuery;
    provision_btn: JQuery;
    route_only_btn: JQuery;
    close_log_btn: JQuery;
    details_form:TunnelDetailsForm;
    state; // current state of the manager
    trail_details = null;
    states = {
        IDLE: 0,
        WAIT_FOR_CREATING: 1,
        WAIT_FOR_BUILDING: 2,
        WAIT_FOR_PROVISION: 3,
        WAIT_FOR_PROVISION_RESULT: 4
    };
    POLL_TIMEOUT = 500; // while I set it to 100 usec, dunno why
    
    constructor(details_form:TunnelDetailsForm, working_table?, protected_table?){
        this.state = this.states.IDLE;
        this.working_table = working_table || null;
        this.protected_table = protected_table || null;
        //this.reset_btn = $("button.cancel");
        this.route_only_btn = $("button.route_only");
        this.provision_btn = $("button.provision");
        this.close_log_btn = $("button.back_from_log");
        this.details_form = details_form;
        this.bind_events();
    }
    
    bind_events(){
        //this.reset_btn.click(()=>this.resetTables());
        this.route_only_btn.click(()=>this.buildAndCreate());
        this.provision_btn.click(()=>this.createAndProvision());
        var protection_dropdown = this.details_form.fields.protectionScheme.el;
        protection_dropdown.change((e)=>this.protectionLevelChanged(e));
        this.close_log_btn.click(()=>{
            // User closed provision log - return to main window
            this.setState(this.states.IDLE);
            $('div.abcd-ui').show();
            $('div.provision-log').hide();
        });
    }
    
    setState(state){
        this.state = state;
        if (state != this.states.IDLE){
            this.provision_btn.prop("disabled", true);
            this.route_only_btn.prop("disabled", true);
            this.reset_btn.prop("disabled", true);
        }
        else {
            this.provision_btn.prop("disabled", false);
            this.route_only_btn.prop("disabled", false);
            this.reset_btn.prop("disabled", false);
        }
        if (state == this.states.WAIT_FOR_PROVISION_RESULT){
            
        }
    }
    
    isBusy(){
        return this.state != this.states.IDLE;
    }
    
    getProtectionScheme(){
        return this.details_form.getProtectionScheme();
    }
    
    getLayerRate(){
        return this.details_form.getLayerRate();
    }
    
    protectionLevelChanged(e){
        var protect_val = this.getProtectionScheme();
        if (protect_val == UNPROTECTED){
            $(".protected_path_table").hide();
        } else {
            $(".protected_path_table").show();
            $(".protected_path_table").removeClass('hidden');
        }
    }
    
    arePathsComplete(){
        var complete = true;
        complete = complete && this.working_table.is_complete; 
        if(this.getProtectionScheme() != UNPROTECTED){
            complete = complete && this.protected_table.is_complete;
        }
        return complete;
    }
    
    verifyAndDo(callback){
        if (this.state != this.states.IDLE){
            alert("Currently waiting respose from the server, can't proceed action");
            return;
        }
        this.details_form.validate((form:TunnelDetailsForm)=>{
            if (form.is_valid){
                if (!this.arePathsComplete()){
                    alert("Your path is not complete");
                    return;
                }
                var details_val = form.getValues();
                callback(details_val);
            } else {
                alert("Check tunnel details data");
            }
        });
    }
    
    buildAndCreate(){
        if (this.trail_details){
            // trail is already created
            alert("You have already created trail " +
                this.trail_details.trailName + ".\nTo proceed reload the page");
        }
        else {
            this.verifyAndDo((d)=>this.buildAndCreate_cb(d));
        }
    }
    
    buildAndCreate_cb(details_val){
        var cbs_stack = [
            (r, b, d)=>{this.finish_buildAndCreate(r, d)}, // this is called last
            (r, b, d)=>{this.buildFromHops(r, b, d)},
            (r, b, d)=>{this.createTrail(r, b, d)} // this is first
        ];
        this._callNextCallback({}, cbs_stack, details_val);
    }
    
    finish_buildAndCreate(response, details_val){
        this.trail_details = details_val;
        if (!response.result){
            alert("Server error: " + response.message);
        } else {
            alert("Trail was created and built");
        }
        this.setState(this.states.IDLE);
    }
    
    createAndProvision(){
        if (!this.trail_details){
            this.verifyAndDo((d)=>this.createAndProvision_cb(d));
        }
        else {
            this.provisionOnly(this.trail_details);
        }
    }
    
    createAndProvision_cb(details_val){
        var cbs_stack = [
            (r, b, d)=>{this.startProvisionPolling(r, b, d)}, // this is called last
            (r, b, d)=>{this.provisionTrail(r, b, d)},
            (r, b, d)=>{this.buildFromHops(r, b, d)},
            (r, b, d)=>{this.createTrail(r, b, d)} // this is first
        ];
        this._callNextCallback({}, cbs_stack, details_val);
    }
    
    provisionOnly(details_val){
        var cbs_stack = [
            (r, b, d)=>{this.startProvisionPolling(r, b, d)}, // this is called last
            (r, b, d)=>{this.provisionTrail(r, b, d)},
        ];
        this._callNextCallback({}, cbs_stack, details_val);
    }
    
    private _callNextCallback(response, cbs_stack, details_val){
        if (cbs_stack.length){
            // get callback function
            var cb = cbs_stack.pop();
            cb(response, cbs_stack, details_val);
        }
        else{
            // stack is empty, drink some beer
        }
    }
    
    buildFromHops(response, cbs_stack, details_val){
        // creation failed
        if (!response.result){
            alert("Server error: " + response.message);
            this.setState(this.states.IDLE);
            return;
        }
        var parameters = {
            buildnetworkelementsinput: {
                "__name": 'route_buildnetworkelementsinput',
                layerRate: details_val.layerRate,
                trailName: details_val.trailName,
                workingPath: this.getWorkingRouteSoFar(),
                protectingPath: this.getProtectedRouteSoFar()
            }
        }
        CyClientApi.make_request(
            "/api/object/routeRequest",
            "build_network_elements_from_hops",
            (response)=>this._callNextCallback(response, cbs_stack, details_val),
            parameters
        )
        this.setState(this.states.WAIT_FOR_BUILDING);
    }
    
    createTrail(result, cbs_stack, details_val){
        var parameters = {
            createtrailinput: {
                "__name": "route_createtrailinput",
                layerRate: details_val.layerRate,
                trailName: details_val.trailName,
                customer: details_val.customer,
                owner: details_val.owner,
                protectionScheme: details_val.protectionScheme, 
                aEndNodeName: this.working_table.aend_node.user_label,
                aEndTpName: this.working_table.aend_port.name,
                zEndNodeName: this.working_table.zend_node.user_label,
                zEndTpName: this.working_table.zend_port.name,
                comment: details_val.comment,
                bvidWorking: details_val.bvidWorking,
                bvidProtecting: details_val.bvidProtecting,
                aEndMAC: details_val.aEndMAC,
                zEndMAC: details_val.zEndMAC
            }
        }
        
        CyClientApi.make_request(
            "/api/object/routeRequest",
            "create_trail",
            (result)=>this._callNextCallback(result, cbs_stack, details_val),
            parameters
        )
        this.setState(this.states.WAIT_FOR_CREATING);
    }
    
    provisionTrail(result, cbs_stack, details_val){
        var parameters = {
            provisiontrailinput: {
                "__name": "route_provisiontrailinput",
                layerRate: details_val.layerRate,
                trailName: details_val.trailName
            }
        }
        
        CyClientApi.make_request(
            "/api/object/routeRequest",
            "provision_trail",
            (result)=>this._callNextCallback(result, cbs_stack, details_val),
            parameters
        )
        this.setState(this.states.WAIT_FOR_PROVISION);
    }
    
    startProvisionPolling(response, cbs_stack, details_val){
        this.trail_details = details_val;
        if (response.result){
            // all right - go to provision polling
            $("div.abcd-ui").hide();
            $("div.provision-log").show();
            $("div.provision-log").removeClass("hidden");
            this.setState(this.states.WAIT_FOR_PROVISION_RESULT);
            this.waitProvisionResult(details_val);
        } else {
            // some error occured
            alert("Server side error: " + response.message);
        }

    }
    
    waitProvisionResult(details_val){
        setTimeout(()=>{
            var parameters = {
                trailstateinput: {
                    "__name": "route_trailstateinput",
                    layerRate: details_val.layerRate,
                    trailName: details_val.trailName
                }
            };
            CyClientApi.make_request(
            "/api/object/routeRequest",
            "get_trail_state",
            (response)=>{
                if (response.result){
                    $("div.provision-log pre").text(response.provisioningLog);
                    if (response.state != PROVISIONED){
                        if (this.state == this.states.WAIT_FOR_PROVISION_RESULT){
                            this.waitProvisionResult(details_val);
                        } // if state is not WAIT_FOR_PROVISION_RESULT, it means
                          // that user canceled provision
                    } else {
                        this.close_log_btn.prop('disabled', true);
                        alert("Trail was provisioned succefully");
                    }
                }
                else{
                    // this.waitProvisionResult(details_val);
                    // some error occured while provisioning
                    alert("Server side error: " + response.message);
                }
            }, parameters)
        }, this.POLL_TIMEOUT)
    }
    
    resetTables(){
        if (this.working_table){ this.working_table.resetPath() }
        if (this.protected_table){ this.protected_table.resetPath() }
    }
    
    getRouteSoFar(table:PathTable){
        if (table){
            return table.getRouteSoFar();
        } else {
            return [];
        }
    }

    getWorkingRouteSoFar(){
        return this.getRouteSoFar(this.working_table);
    }

    getProtectedRouteSoFar(){
        if (this.getProtectionScheme() == UNPROTECTED){
            return [];
        }
        return this.getRouteSoFar(this.protected_table);
    }
    
    addAEndNode(node){
        if (this.working_table){this.working_table.addAEndNode(node)}
        if (this.protected_table){this.protected_table.addZEndNode(node)}
    }
    
    addZEndNode(node){
        if (this.working_table){this.working_table.addZEndNode(node)}
        if (this.protected_table){this.protected_table.addAEndNode(node)}
    }
    
    setPortForNode(node, port, end_type, errback){
        // Check here whether port endpoint valid or not
        // errback - callback for case endpoint is invalid
        
        CyClientApi.make_request(
            "/api/object/routeRequest",
            "is_valid_endpoint",
            (result)=>this.setPortForNode_cb(result, node, port, end_type, errback),
            {
                validendpointinput: {
                    "__name": "route_validendpointinput",
                    nodeName: node.user_label,
                    endTpName: port.name,
                    layerRate: this.details_form.getLayerRate()
                }
            }
        );
    }
    
    setPortForNode_cb(result, node, port, end_type, errback){
        var nend_type = (end_type=='aend')?'zend':'aend';
        if (result.validity){
            if (this.working_table){this.working_table.setPortForNode(node, port, end_type)}
            if (this.protected_table){this.protected_table.setPortForNode(node, port, nend_type)}
        } else {
            errback();
            // reset port for ends due to error
            if (this.working_table){this.working_table.setPortForNode(node, null, end_type)}
            if (this.protected_table){this.protected_table.setPortForNode(node, null, nend_type)}
        }
    }
    
}


var _editor_class_map = {
                    node:           NodeEditor,
                    ingress_port:   IngressPortEditor,
                    egress_port:    EgressPortEditor,
                    trail:          TrailEditor
                }


// This is cell editor factory which determine cell
// type end constructs necessary editor for this
// cell
function cellEditorFactory(pathTable:PathTable){
    
    var wrapped = function(container, options){
        
        var rowEl = container.closest("tr");
        var rowIdx =  $("tr", pathTable.grid.tbody).index(rowEl);
        
        if (pathTable.isCellEditable(rowIdx, options.field)){
            var editor_cls = _editor_class_map[options.field];
            var editor = new editor_cls(rowIdx, pathTable, container, options);
            editor.create()  
        }
        else{
            pathTable.grid.closeCell();
        }; 

    }
    return wrapped;
}



/* This class implements dynamic path table */
export class PathTable{
    
    // Class properties go here
    
    grid;
    grid_selector;
    rows_count;
    rows_data: IPathRow[];
    aend_node = null;
    zend_node = null;
    aend_port = null;
    zend_port = null;
    manually_added_hop: number;
    manager: TablesManager;
    is_complete: boolean;

    constructor(grid_id: string, manager?: TablesManager){
        // Create new Kendo Grid here
        
        this.grid_selector = grid_id;
        this.rows_count = 0;
        this.rows_data = [];
        this.manually_added_hop = null;
        this.manager = manager || null;
        this.is_complete = false;
        
        var editor = cellEditorFactory(this);
        
        $(add_new_hop_link + '[data-for="' + grid_id + '"]').click(()=>{
            this.insertNewHop();
            return false;
        });
        
        $(grid_id).kendoGrid({
        scrollable: true,
        selectable: true, 
        editable: true,
        columns: [
                { field: "node", editor: editor, height: ROW_HEIGHT },
                { field: "ingress_port", editor: editor, height: ROW_HEIGHT },
                { field: "egress_port", editor: editor, height: ROW_HEIGHT },
                { field: "trail", editor: editor, height: ROW_HEIGHT }
            ],
        });
        
        this.grid = $(grid_id).data('kendoGrid');
    }
    
    // checks whether hop is added manually 
    isManuallyAddedHop(rowIdx: number):boolean{
        return this.manually_added_hop == rowIdx;
    }
        
    isAEndRow(rowIdx):boolean{
        return rowIdx == 0;
    }
    
    isZEndRow(rowIdx):boolean{
        return rowIdx == this.rows_count - 1;
    }
    
    // checks if given cell is editable or no
    isCellEditable(rowIdx: number, fieldName: string):boolean{
        
        if (this.manager){
            if (this.manager.isBusy()){
                alert("Table is temporary disabled for editing.\nSome server process is going");
                return false;
            }
        }
        
        if (!this.zend_node || !this.aend_node || !this.aend_port || !this.zend_port){
            return false;
        } else
        
        if (this.isZEndRow(rowIdx)){
            return false;
        }
            
        if (this.isManuallyAddedHop(rowIdx)){
            var node = this.rows_data[rowIdx].node; 
            return {"node": true, // always true for node
                    "ingress_port": node != null,
                    "egress_port": false,
                    "trail": node != null}[fieldName];
        } else {
           return {"node": false,
                   "ingress_port": false,
                   "egress_port": true,
                   "trail": true}[fieldName]
        }
                
        // in all other cases cell is editable
        return true;
    }
    
    setNextHop(hop:IHop, node_number: number){
        var removedRow = null;
        var path_is_complete = false;
        
        this.rows_data[node_number].egress_port = {name: hop.egressTpName}
        this.rows_data[node_number].trail = {name: hop.ethernetTrailName}
        
        // check next node here
        var next_node = this.rows_data[node_number + 1].node;
        while(this.zend_node.user_label != next_node.user_label){
            // rid here all blind gut hops
            removedRow = this.rows_data.splice(node_number + 1, 1)[0];
            this.rows_count--;
            next_node = this.rows_data[node_number + 1].node;
        }
        
        if( hop.nextNodeName == next_node.user_label){
            // we reached z-end node
            this.rows_data[node_number + 1].ingress_port = {name: hop.ingressTpName};
            // need to triger something to say that we done
            path_is_complete = true;
        } else {
            this.getNextHops(hop.nextNodeName, hop.ingressTpName, node_number + 1);
            // if path is not complete remove last hope ingress port
            this.rows_data[this.rows_count - 1].ingress_port = null;
        }

        this.repopulateGrid();
        this.is_complete = path_is_complete;
    }
    
    // this gets all possible ports and trails for AEnd node
    getNextHops(node_name, ingress_tp_name, hop_index){
        var rowIdx = this.rows_count - 1;
        // TODO: too many hard<s>core</s>code here
        // should be generic or with using constants
        CyClientApi.make_request(
            "/api/object/routeRequest",
            "get_next_hops",
            (result)=>{ this.getNextHops_cb(hop_index, result) },
            {nexthopsinput: {
                __name: "route_nexthopsinput",
                layerRate: TESI_LayerRate,
                nodeName: node_name,
                protectionScheme: (this.manager)?this.manager.getProtectionScheme():1,
                routeRole: 0,
                ingressTpName: ingress_tp_name,
                workingRouteSoFar: this.getWorkingRouteSoFar(),
                protectedRouteSoFar: this.getProtectedRouteSoFar()
            }}
        );
        if (hop_index){
            this.insertNodeToPath(rowIdx, {user_label: node_name},
                                        {name: ingress_tp_name});
        }
    }

    getNextHops_cb(hop_index, result){
        this.rows_data[hop_index].hops = result.hops;
    }

    addAEndNode(node){
        var index = 0;
        this.aend_port = null;
        if (this.aend_node){
            this.aend_node = node;
            this.resetPath();
        }
        else{
            this.aend_node = node;
            this.insertNodeToPath(index, node);
        }
    }
    
    addZEndNode(node){
        var index = this.rows_count;
        this.zend_port = null;
        if (this.zend_node){
            this.zend_node = node;
            this.resetPath();
        }
        else{
            this.zend_node = node;
            this.insertNodeToPath(index, node);
        }
    }

    setPortForNode(node, port, end_type){
         for (var i in this.rows_data){
             var row_data:IPathRow = this.rows_data[i];
             if (row_data.node.user_label == node.user_label){
                // set port as egress port for aend node
                if (this.aend_node && end_type=='aend'){
                    row_data.ingress_port = port;
                    this.aend_port = port;
                    if (port) { // we need check this as still we may pass null as port
                        this.getNextHops(this.aend_node.user_label, this.aend_port.name, 0);
                    }
                    break;
                } else if(this.zend_node && end_type=='zend') {
                // Use ingress port for all other nodes
                    row_data.egress_port = port;
                    this.zend_port = port;
                    break;
                }
             }
         }
         this.resetPath();
    }
    
    resetPath(){
        // reset path
        this.is_complete = false;
        this.rows_data = [];
        if (this.aend_node){
            this.rows_data[0] = {node: this.aend_node, ingress_port: this.aend_port,
                        egress_port: null, trail: null, hops: []}
            if(this.aend_port){
                this.getNextHops(this.aend_node.user_label, this.aend_port.name, 0);
            }
        }
        if (this.zend_node){
            this.rows_data[1] = {node: this.zend_node, ingress_port: null,
                        egress_port: this.zend_port, trail: null, hops: []}
        }
        this.rows_count = this.rows_data.length;
        this.repopulateGrid();
    }
    
    insertNodeToPath(index: number, node, ingress_port?){
        var dataSource = this.grid.dataSource;
        // add to grid logic should goes here
        var row_data = {node: node, ingress_port: null,
                        egress_port: null, trail: null, hops: []}
        if (typeof(ingress_port) != 'undefined'){
            row_data.ingress_port = ingress_port;
        }
        this.rows_data.splice(index, 0, row_data);
        this.rows_count++;
        this.repopulateGrid();
    }
            
    insertNewHop(){
        if (!this.aend_node || !this.zend_node || this.manually_added_hop != null){
            // no aend or zend defined - so simply
            // ignore this call
            return;
        }
        var manually_aded_hop_id = this.rows_count - 1;
        this.insertNodeToPath(manually_aded_hop_id, null);
        this.manually_added_hop = manually_aded_hop_id;
    }
            
    getRouteSoFar(){
        var route_so_far = [];
        for (var i in this.rows_data){
            var row_data = this.rows_data[i];
            var trail = row_data.trail;
            if (trail){ route_so_far.push(trail.name) }
        }
        return route_so_far;
    }
                
    getWorkingRouteSoFar(){
        return (this.manager)?this.manager.getWorkingRouteSoFar(): [];
    }
        
    getProtectedRouteSoFar(){
        return (this.manager)?this.manager.getProtectedRouteSoFar(): [];
    }
    
    private rowDataToGridRow(row_data: IPathRow){
        var node = ' ';
        var inport = '';
        var egport = '';
        var trail = ' ';
        
        if (row_data.node){ node = " " + row_data.node.user_label };
        if (row_data.ingress_port){ inport = row_data.ingress_port.name };
        if (row_data.egress_port){ egport = row_data.egress_port.name };
        if (row_data.trail){ trail = " " + row_data.trail.name };
        
        return {
                node: node,
                ingress_port: inport,
                egress_port: egport,
                trail: trail
            }
    }
    
    private repopulateGrid(){
        // clear first all grid data
        this.manually_added_hop = null;
        this.grid.dataSource.data([]);
        for (var i in this.rows_data){
            var row_data = this.rows_data[i];
            this.grid.dataSource.add(this.rowDataToGridRow(row_data));
        }
    }
}


export class EndNodeSelector{
    type: string;
    opposite;
    table_manager: TablesManager;
    input: JQuery;
    port_input: JQuery;
    button: JQuery;
    choose_port_btn: JQuery; 
    node = null; // chosen node
    port = null;
    nodeSelector: CyNodeSelector = null;
    portSelector: CyPortSelector = null;
    ports_data;
    ipaddress: JQuery;
    
    
    constructor(type: string, table_manager){
        this.type = type;
        this.table_manager = table_manager;
        this.button = $(".choose_" + this.type + " button");
        this.input = $(".choose_" + this.type + " input");
        this.ipaddress = $("span." + this.type + "_ip_address");
        
        this.port_input = $(".choose_" + this.type + "_port input");
        this.choose_port_btn = $(".choose_" + this.type + "_port button");
        
        this.button.click(()=>{
            //var window = new CyNodeSSF.NodeSelectorWindow(600, 500, (node) => this.validate_node(node));
            this.nodeSelector = new CyNodeSelector(false, CyDirectConnectors.CyNodeConnector);
            this.nodeSelector.on(CyWindow.kEVENT_CLOSING, $.proxy(this.onNodeSelectorClosed, this));
            return false;
        });
        
        this.choose_port_btn.click(()=>{
            if (!this.node){
                // before choosing node
                alert("You should choose the node");
            } else {
               
               this.portSelector = new CyPortSelector(this.node.user_label, false, CyDirectConnectors.CyPortConnector);
               this.portSelector.on(CyWindow.kEVENT_CLOSING, $.proxy(this.onPortSelectorClosed, this))
            }
            return false;
        });
        
        this.input.change((e)=>{this.manually_changed(e)});
        this.port_input.change((e)=>{this.port_manually_changed(e)});
    }
    
    onNodeSelectorClosed(e){
        
        if (this.nodeSelector.modalResult == CyDialog.kMODAL_OK) {
            var node = this.nodeSelector.selections[0];
            this.validate_node(node);
        }
        this.nodeSelector = null;
    }
        
    onPortSelectorClosed(e){
        if (this.portSelector.modalResult == CyDialog.kMODAL_OK) {
            var port = this.portSelector.selections[0];
            this.set_to_pathtable(port);
        }
        this.portSelector = null;
    }
    
    manually_changed(e){
        // should check here for existance of such node
        var node_name = this.input.val();
        CyClientApi.make_request('/api/object/node', 'get',
            (result)=>{this.check_node_cb(result)}, {filter: node_name}); 
    }
                    
    check_node_cb(result){
        var inputed_node = this.input.val(); 
        if (result.objects.length){
            for (var i in result.objects){
                var node = result.objects[i];
                // TODO: while it;s case sensetive
                // need to figure out - should it be
                // case sensetive or not
                if (node.user_label == inputed_node){
                    this.validate_node(node);
                    return;
                }
            }
        }
        
        // Node is invalid - say abt it
        this.ipaddress.text('invalid node');
        this.ipaddress.css({color: "red"});
    }
                    
    port_manually_changed(e){
        var port_name = this.port_input.val();
        if (port_name.toLowerCase().indexOf("fac-") == -1){
            port_name = "FAC-" + port_name;
        }
        this.port_input.val(port_name);
        this.set_to_pathtable({name: port_name});
    }
    
    validate_node(node){

        this.node = node;
        this.port = null;
        this.input.val(node.user_label);
        this.ipaddress.text(node.resolved_ip_address + ", " + node.sw_version);
        this.port_input.val('');
        this.port_input.css({background: VALID_VALUE_BG});
        // set default color for ip address of the node
        // TODO: should be generic may be 
        this.ipaddress.css({color: "black"});
        if (this.type == 'aend'){
            this.table_manager.addAEndNode(node);
        } else if (this.type == 'zend'){
            this.table_manager.addZEndNode(node);
        }
        this.ports_data = null;
    }
    
    set_to_pathtable(port){
        var node = this.node;
        this.port = port;
        this.port_input.val(port.name);
        this.port_input.css({background: VALID_VALUE_BG});
        this.table_manager.setPortForNode(node, port, this.type,
            ()=>{ this.port_input.css({background: INVALID_VALUE_BG}); });        
    }
}


export class GuaranteedBandwidthWidget{
    checkbox: JQuery;
    dropdown: JQuery;
    
    constructor(){
        this.checkbox = $(bandwidth_chkbx);
        this.dropdown = $(bandwidth_selector);
        this.bind_events()
    }
    
    bind_events(){
        this.checkbox.click(()=>{
            if(this.checkbox.prop("checked")){
                this.dropdown.prop("disabled", false);
            } else {
                this.dropdown.prop("disabled", true);
            }
        });
    }
}


export class ManualAssignedIDWidget{
    checkbox: JQuery;
    verify_btn: JQuery;
    
    constructor(){
        this.checkbox = $(manual_assign_id_chkbx);
        this.verify_btn = $(verify_id_btn);
        this.bind_events()
    }
    
    bind_events(){
        this.checkbox.click(()=>{
            if(this.checkbox.prop("checked")){
                this.verify_btn.prop("disabled", false);
            } else {
                this.verify_btn.prop("disabled", true);
            }
        });
    }
}


export function main(callback?){
    
    // i18n initialization
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
    
    CyTemplates.loadTemplate("master.html", function () {
        $.i18n.init(option, function(){
            var details_form = new TunnelDetailsForm();
            var table_manager = new TablesManager(details_form);
            var workingTable = new PathTable(gridSelectorWorking, table_manager);
            var protectedTable = new PathTable(gridSelectorProtected, table_manager);
            table_manager.working_table = workingTable; 
            table_manager.protected_table = protectedTable; 
            
            var aend_selector = new EndNodeSelector('aend', table_manager);
            var zend_selector = new EndNodeSelector('zend', table_manager);
            
            aend_selector.opposite = zend_selector;
            zend_selector.opposite = aend_selector;
            
            var manual_assigned_id_w = new ManualAssignedIDWidget();
            var guaranteed_bandwidth_w = new GuaranteedBandwidthWidget();

            if(callback){ callback(); }
        })
    });
    
}


// App entry point
$(document).ready(main)
