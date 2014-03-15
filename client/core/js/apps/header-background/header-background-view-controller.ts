/**
 * Created by Nil on 2/17/14.
 */

import HeaderBackgroundView = require('./header-background-view');

class HeaderBackgroundViewController extends Marionette.Controller{

    private _view : HeaderBackgroundView;

    constructor(View){
        super();
        this._view = View;
    }

    public collapse(): void{
        $(this._view.el).addClass('closed');
    }

    public expand(): void{
        $(this._view.el).removeClass('closed');
    }

}

export =  HeaderBackgroundViewController;