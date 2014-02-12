
/// <reference path='interfaces/db.d.ts'/>

class User {
    private __v : string;
    private _id : string;
    private username : string;
//    TODO: add class Class
//    private classes : Class[];

    constructor(json ?: IUserSchema) {
        this.__v = json.__v;
        this._id = json._id;
        this.username = json.username;
    }
}

export = User;