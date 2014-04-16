
/// <reference path='../vendor/backbone/marionette.d.ts'/>

class HeaderModel extends Backbone.Model{
    private _data:any;
    public get data():any {
        return this._data;
    }

    constructor(){
        super();
        this._data = {
            menuitems: [{
                class_name: 'home-link',
                href: '/',
                name: '个人主页'
            }, {
                class_name: 'message-link',
                href: '/',
                name: '消息中心'
            }, {
                class_name: 'class-link',
                href: '/',
                name: '我的班级'
            }],
            school:{
                school_name: '平和学校',
                school_logo: '/core/img/school-logo-pinghe-login-white.png'
            }
        };
    }
}

export = HeaderModel;