
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class UserModel extends Backbone.Model{
    constructor(attrs, options?) {
        super(attrs, options);
        this.urlRoot = '/api/v1/account';
        this.idAttribute = "_id";
    }
}

export = UserModel;