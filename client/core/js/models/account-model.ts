
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class AccountModel extends Backbone.Model{
    constructor(attrs?, options?) {
        super(attrs, options);
        this.url = '/api/v1/account';
    }

    public defaults(){
        return {
            "username":current_user.username,
            "_id":current_user._id,
            "user_image":current_user.user_image
        }
    }

    public parse(response) {
        console.log("Receive AccountModel:"+response);
        return response.result;
    }
}

export = AccountModel;