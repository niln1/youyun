
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class AccountModel extends Backbone.Model{
    constructor(attrs?, options?) {
        super(attrs, options);
        this.url = '/api/v1/account';
    }

    public parse(response) {
        console.log("Receive AccountModel:"+response);
        var raw = response.result;
        raw.user_image = "a";
        return response.result;
    }
}

export = AccountModel;