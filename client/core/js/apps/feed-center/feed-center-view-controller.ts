/// <reference path='../../vendor/moment/moment.d.ts'/>
/// <reference path='../../vendor/backbone/marionette.d.ts'/>

import FeedCenterView = require('./feed-center-view');

class FeedCenterViewController {
    private _view : FeedCenterView;

    public momentConfigFormat : string = 'LL, dddd';
    public momentConfigLang : string = 'zh-cn';

    constructor(View){
        this._view = View;
    }

    public updateTime(): void {
        moment.lang(this.momentConfigLang);
        var time_element = moment().format(this.momentConfigFormat);
        $(this._view.timestampID).text(time_element);
    }
}
export = FeedCenterViewController;