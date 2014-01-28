/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/kendo.web.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/i18next.d.ts" />


declare var CryptoJS;

// Users private key map
// TODO: should be passed directly to application  

export var API_VERSION  = 1;

var _map = {
        // this is admin's private key
        1: "tAziQJWmKvdCbM6GbbQ0SHjShsEcIdVd476bFyc1",
        1000: "QtfnfRZxumO87AyNTJ5iVnsI7WJQDhN5lTZkSE87"
    }

/*
 * private property which represents curren_user ID
 */
var _current_user = 1;

/*
 * next two functions set_user_keys and set_current_user
 * should be used for integrating web UI with desktop GUI
 * trough these function client may set keys for accessing
 * API service
 */

/*
 * This sets dictionary of the secret key values for user
 * should be set as pair user_id: secret key
 */
export function set_user_keys(_keys){
    _map = _keys; 
}

/*
 * This sets current user id should be used for API access
 */
export function set_current_user(user_id: number){
    _current_user = user_id;
}

export function get_current_user_key(){
    return _map[_current_user];
}

export function get_current_user(){
    return _current_user;
}


function _get_signature(url:string, private_key:string){
    var decoded_key = CryptoJS.enc.Base64.parse(private_key);
    var signature = CryptoJS.HmacSHA1(url, decoded_key);
    var base64_signature = CryptoJS.enc.Base64.stringify(signature);
    return base64_signature;
}


function _sign_url(url:string, private_key:string): string{
    return url + "&s=" + _get_signature(url, private_key);
}

/*
 * Sign given url with given private_key before sending
 */
export function sign_url_with_key(url:string, private_key:string){
    return _sign_url(url, private_key)   
}

export function get_signature(url:string, private_key:string){
    
}


export function make_request(uri: string, command: string, cb, kwargs?){
    /*
     * This function makes request to API service, 
     * you may use it like on example below 
     * 
     * import CyClientApi = require('cy-clientapi');
     * CyClientApi.make_request(uri, command, function(){
     *                                      // do some callback here
     *                                  });
     */
    
    /*
     * Request structure is
     * (http|https)://uri?m=<method_name>&u=<user_name>&v=<api_version>&i=<index>&c=<count>
     */
    
    var user_id = _current_user; // while it's hardcoded
    var url = uri;
    url += "?v=" + API_VERSION;
    url += "&u=" + user_id;
    url += "&m=" + command;
    
    // and then add all key word arguments
    // if kwargs argument is provided
    if (typeof(kwargs) != 'undefined'){
        for (var key in kwargs){
            var value = kwargs[key];
            if (typeof(value) == "object"){
                value = JSON.stringify(value);
            }
            value = encodeURIComponent(value).replace(/%20/g,'+');
            url += "&" + key + "=" + value;
        }
    }
     
    var user_key = _map[user_id];
    url = _sign_url(url, user_key);
        
    var request = $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        
    }).done(cb);
    
}