/**
 * Created by Nil on 2/17/14.
 */

import HeaderBackgroundView = require('./header-background-view');

class HeaderBackgroundViewController {

    private _view : HeaderBackgroundView;

    constructor(View){
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