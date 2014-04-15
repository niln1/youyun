
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class AccountModel extends Backbone.Model{
    constructor(attrs?, options?) {
        super(attrs, options);
        this.url = '/api/v1/account';
    }

    public defaults(){
        return {
            "username":current_user.username,
            "_id":current_user.username,
            "user_image":"/static/img/user_image/"+current_user._id+"_"+current_user.username+".png"
        }
    }

    public parse(response) {
        console.log("Receive AccountModel:"+response);
        var raw = response.result;
        raw.user_image = "/static/img/user_image/"+raw._id+"_"+raw.username+".png";
        return response.result;
    }
}

export = AccountModel;