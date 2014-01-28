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

/* This is an implementation of the SSF(search-sort-filter) pattern for
 * node selection in web view
 */

///////////////////////////////////////////////////////////////////////////////
//  _                            _                                           //
// (_)_ __ ___  _ __   ___  _ __| |_ ___                                     //
// | | '_ ` _ \| '_ \ / _ \| '__| __/ __|                                    //
// | | | | | | | |_) | (_) | |  | |_\__ \                                    //
// |_|_| |_| |_| .__/ \___/|_|   \__|___/                                    //
//             |_|                                                           //
///////////////////////////////////////////////////////////////////////////////

import CyClientApi = require("./cy-clientapi");
import CyWindow = require("./ui/window/cy-window");

///////////////////////////////////////////////////////////////////////////////
//                     _              _                                      //
//  ___ ___  _ __  ___| |_ __ _ _ __ | |_ ___                                //
// / __/ _ \| '_ \/ __| __/ _` | '_ \| __/ __|                               //
//| (_| (_) | | | \__ \ || (_| | | | | |_\__ \                               //
// \___\___/|_| |_|___/\__\__,_|_| |_|\__|___/                               //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//      _                     _       __ _       _ _   _                     //
//  ___| | __ _ ___ ___    __| | ___ / _(_)_ __ (_) |_(_) ___  _ __  ___     //
// / __| |/ _` / __/ __|  / _` |/ _ \ |_| | '_ \| | __| |/ _ \| '_ \/ __|    //
//| (__| | (_| \__ \__ \ | (_| |  __/  _| | | | | | |_| | (_) | | | \__ \    //
// \___|_|\__,_|___/___/  \__,_|\___|_| |_|_| |_|_|\__|_|\___/|_| |_|___/    //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

export interface IObjectColumn {
    field_name: string;
    title: string;
    object_property: string;
}

export interface IObjectConfig {
    name: string;
    columns: IObjectColumn[];
    api_url: string; // API for getting 
    api_method: string;
    filter_parameter: string; // for API filtering
    filter_field: string; // for online filtering
}


// Abstract implementation of the SSF pattern for some objects

export class ObjectSSFWindow extends CyWindow {
    
    private callback; // should be called when value is selected
    private grid; // Kendo grid object
    private grid_el; // grid html element
    public object_filter_input;
    private obj_config: IObjectConfig;
    private uuid_to_obj;
    on_close;
    static_data = null; // static data may be used instead of getting it from the server
    
    constructor (width: number, height: number, title: string,
                obj_config: IObjectConfig, callback, data?, on_close?) {
        super({
            width: width,
            height: height,
            title: title
        });
        
        this.static_data = data || null;
        this.on_close = on_close || null;
        
        this.callback = callback;
        this.obj_config = obj_config
        this.center();
        this.object_filter_input = $('<input />');
        this.object_filter_input.css('width', '100%');
        
        this.grid_el = $('<div id="' + obj_config.name + '_ssf_grid"/>');
        
        this.inner.append(this.object_filter_input);
        this.inner.append(this.grid_el);
        
        // make columns
        var columns = [];
        var col_width = width / this.obj_config.columns.length;
        
        for (var i in this.obj_config.columns){
            var col_def = this.obj_config.columns[i];
            columns.push({
                field: col_def.field_name,
                title: col_def.title,
                width: col_width
            })
        }
        
        // construct grid
        this.grid_el.kendoGrid({
                        selectable: true,
                        //sortable: true,
                        pageable: {
                            pageSizes: true,
                            pageSize: 10,
                            buttonCount: 5
                        },
                        dataBound: (e)=>this.bindDblClickEvent(),
                        columns: columns
                    });
        this.grid = this.grid_el.data("kendoGrid");
        
        this.bind_events();
        this.get_objects();

        //this.grid_el.find("tbody tr").on('dblclick', (e) => { this.obj_chosen(e) });
    }
    
    bind_events(){
        this.object_filter_input.keyup(() => {
            var filter_query = this.object_filter_input.val();
            this.get_objects(filter_query);
        });
        
        // This allows to choose object by pressing enter if we have only
        // object in table
        this.object_filter_input.keypress((e)=>{
            // enter was pressed
            if (e.which == 13) {
                var data = this.grid.dataSource.data();
                // we prssed enter and now we have only one item in row
                if (data.length == 1){
                    var uid = data[0]['uid'];
                    var obj = this.uuid_to_obj[uid];
                    this.close();
                    this.callback(obj);
                }
            }
        });
    }
    
    get_objects(filter_val?){
        if (!this.static_data){
            var kw = {};
            if (typeof(filter_val) != 'undefined' && filter_val.length)
                kw[this.obj_config.filter_parameter] = filter_val;
            CyClientApi.make_request(this.obj_config.api_url, this.obj_config.api_method, 
                (result)=>{this.got_objects(result.objects)}, kw);
        }
        else {
            if (this.obj_config.filter_field){
                // filetr field is specified so we may proceed
                // with filtering
                if (typeof(filter_val) == 'undefined' || !filter_val.length){
                    this.got_objects(this.static_data);
                    return;
                }
                var filtered_data = [];
                for (var i in this.static_data){
                    var obj = this.static_data[i];
                    var filtered_value = obj[this.obj_config.filter_field];
                    filtered_value = filtered_value.toLowerCase();
                    if (filtered_value.indexOf(filter_val.toLowerCase()) != -1){
                        filtered_data.push(obj);
                    }
                }
                this.got_objects(filtered_data);
            }
        }
        
    }
    
    bindDblClickEvent(){
        this.grid_el.find("tbody tr").dblclick((e) => { this.obj_chosen(e) });
    }
    
    got_objects(objects){
        this.uuid_to_obj = [];
        var data_list = [];
        for (var i in objects){
            var obj = objects[i];
            var data = {}
            for (var k in this.obj_config.columns){
                var col = this.obj_config.columns[k];
                data[col.field_name] = obj[col.object_property];
            }
            data_list.push(data);
        }
        this.grid.dataSource.data(data_list);
        var source_data = this.grid.dataSource.data(); 
        for (var i in objects){
            var obj = objects[i];
            var obj_uuid = source_data[i]['uid'];
            this.uuid_to_obj[obj_uuid] = obj;
        }
        
        this.bindDblClickEvent();
    }
    
    obj_chosen(e){
        // Get chosen element recursively
        function _getUIDRecursive(el){
            if (typeof(el.attr('data-uid')) != 'undefined'){
                return el.attr('data-uid');
            }
            else{
                return _getUIDRecursive(el.parent());
            }
        };
        var obj_uid = _getUIDRecursive($(e.target));
        var obj = this.uuid_to_obj[obj_uid];
        this.close();
        this.callback(obj);
    }
    
    close(){
        if (this.on_close){
            this.on_close()
        }
        super.close();
    }
}


export class NodeSelectorWindow extends ObjectSSFWindow{
    
    
    constructor(width, height, callback) {
        
        super( width, height, "Choose the Node",
            {
                name: "node",
                columns:[
                    {field_name: "name", title:"Name", object_property: "user_label"},
                    {field_name: "ip_address", title:"DCN IP Adress(resolved)", object_property: "resolved_ip_address"},
                    {field_name: "status", title:"Alarm Status", object_property: "alarm_status_label"},
                    {field_name: "state", title:"Comm State", object_property: "communication_state_label"},
                ],
                api_url: "/api/object/node",
                api_method: "get",
                filter_parameter: "filter",
                filter_field: null           
                
            }, callback
        );
    }
}


export class PTPSelectorWindow extends ObjectSSFWindow{
    private nodeName: string;
    
    constructor(width, height, nodeName, callback, static_data, on_close) {        
        
        super( width, height, "Choose the Port of " + nodeName + " node",
            {
                name: "ptps",
                columns:[
                    {field_name: "name", title:"Name", object_property: "name"},
                ],
                api_url: "",
                api_method: "",
                filter_parameter: "",                
                filter_field: "name"
            }, callback, static_data, on_close
        );
        
    }
}