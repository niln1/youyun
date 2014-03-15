
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class User extends Backbone.DeepModel {
    public _validators:{[index:string]:string[]};
    private static validators:{[index:string]:string[]} = {
        __V: ['required'],
        _id: ['required'],
        username: ['required']
    };

    constructor(attrs?:any, options?:any) {
        super(attrs, options);

        this._validators = User.validators;
    }
}

export = User;