
/// <reference path='../vendor/backbone/marionette.d.ts'/>

declare var current_user;
class AccountModel extends Backbone.Model{

    constructor(attrs?, options?) {
        super(attrs, options);
        this.url = '/api/v1/account';
    }
    public defaults(){
        return {
            "username":current_user.username,
            "_id":current_user._id,
            "userImage":current_user.userImage
        }
    }

    public parse(response) {
        console.log("Receive AccountModel:"+JSON.stringify(response));
        return response.result;
    }
}

export = AccountModel;