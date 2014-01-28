/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/i18next.d.ts" />

///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2006-2014 by Cyan Optics Inc.                               //
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

///////////////////////////////////////////////////////////////////////////////
//  _                            _                                           //
// (_)_ __ ___  _ __   ___  _ __| |_ ___                                     //
// | | '_ ` _ \| '_ \ / _ \| '__| __/ __|                                    //
// | | | | | | | |_) | (_) | |  | |_\__ \                                    //
// |_|_| |_| |_| .__/ \___/|_|   \__|___/                                    //
//             |_|                                                           //
///////////////////////////////////////////////////////////////////////////////

import CyConnector = require("./cy-connector");
import CyClientApi = require("../../cy-clientapi")

///////////////////////////////////////////////////////////////////////////////
//                     _              _                                      //
//  ___ ___  _ __  ___| |_ __ _ _ __ | |_ ___                                //
// / __/ _ \| '_ \/ __| __/ _` | '_ \| __/ __|                               //
//| (_| (_) | | | \__ \ || (_| | | | | |_\__ \                               //
// \___\___/|_| |_|___/\__\__,_|_| |_|\__|___/                               //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////

/**
 * CySecureConnector is the extending of usual CyConnector class which performs
 * secure signing of the API request and should work directly with operate API
 * service directly  
 * @class CySecureConnector
 */

export class CySecureConnector extends CyConnector{
    
    api_method: string;
    
    public prepareRequest(e:any) : string {
        
        var url: string = super.prepareRequest(e);

        // some parameters are not supported by operate API
        // we need to patch them to get worked
        if (typeof(e.index)!="undefined"){
            e.i = e.index;
            delete e.index;
        };
        
        if (typeof(e.count)!="undefined"){
            e.c = e.count;
            delete e.count;
        }
        
        // add extra url parameters
        
        e.v = CyClientApi.API_VERSION;
        e.u = CyClientApi.get_current_user();
        e.m = this.api_method || "get";
        
        if (Object.keys(e).length > 1) {
            url += "?";
            var params = [];
            _.each(e, (val, key?:any) => {
                if (val) {
                    params.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                }
                delete e[key];
            });

            url += params.join('&');
        }
        var secret_key = CyClientApi.get_current_user_key();
        url = CyClientApi.sign_url_with_key(url, secret_key);
        return url;
    }

}

/*
 * Alternate connector for getting nodes directly from API
 */
export class CyNodeConnector extends CySecureConnector {

    constructor() {

        super("/api/object/node");
    }
}


/*
 * Alternate connector for getting ports directly from API
 */
export class CyPortConnector extends CySecureConnector {
    
    api_method: string = "get_tps";
    nodename: string;

    constructor(nodename) {
        super("/api/object/routeRequest");
        this.nodename = nodename;
    }
    
    public prepareRequest(e:any) : string {
        
        e.nodename = this.nodename;
        var url: string = super.prepareRequest(e);
        return url;
    }
}
