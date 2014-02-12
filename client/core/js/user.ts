
/// <reference path='interfaces/db.d.ts'/>
/// <reference path='vendor/backbone/marionette.d.ts'/>

class User extends Backbone.DeepModel {
    private __v : string;
    private _id : string;
    private username : string;
//    TODO: add class Class
//    private classes : Class[];

    public _validators:{[index:string]:string[]};
    private static validators:{[index:string]:string[]} = {
        __V: ['required'],
        _id: ['required'],
        username: ['required']
    };

    constructor(attrs?:any, options?:any) {
        super(attrs, options);

        this._validators = User.validators;
//        this.__v = json.__v;
//        this._id = json._id;
//        this.username = json.username;
    }
}

export = User;