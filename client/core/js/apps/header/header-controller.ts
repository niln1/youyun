/// <reference path='../../vendor/backbone/marionette.d.ts'/>

import HeaderView = require('./header-view');
import HeaderModel = require('../../models/header-model');

class HeaderController {
    public static instance:HeaderController;

    public static get I():HeaderController {
        if (!HeaderController.instance) HeaderController.instance = new HeaderController();
        return HeaderController.instance;
    }

    public static set I(I:HeaderController) {
        HeaderController.instance = I;
    }

    private view:HeaderView;
    private model:HeaderModel;

    constructor(){
        this.model = new HeaderModel();
        this.view = new HeaderView(this.model.data);
    }

    public show(){

    }

    public setActive(idName){

    }
}
export = HeaderController;