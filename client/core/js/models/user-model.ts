
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class UserModel extends Backbone.Model{
    private _data:any;
    public get data():any {
        return this._data;
    }

    constructor(){
        super();
        this._data = {
            user:{
                username: 'pingheschool',
                full_name:  '平和学校',
                user_image: '/core/img/school-logo-pinghe-login.png'
            }
        };
    }
}

export = UserModel;