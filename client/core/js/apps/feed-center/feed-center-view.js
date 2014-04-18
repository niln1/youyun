var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../config/base-item-view', "./templates/feed-center-view-tmpl"], function(require, exports, BaseItemView) {
    var FeedCenterView = (function (_super) {
        __extends(FeedCenterView, _super);
        function FeedCenterView(options) {
            _super.call(this, options);
            this.timestampID = '#content-time-heading';
            this.momentConfigFormat = 'LL, dddd';
            this.momentConfigLang = 'zh-cn';
            this.template = require('./templates/feed-center-view-tmpl');
        }
        FeedCenterView.prototype.updateTime = function () {
            moment.lang(this.momentConfigLang);
            var time_element = moment().format(this.momentConfigFormat);
            $(this.timestampID).text(time_element);
        };
        return FeedCenterView;
    })(BaseItemView);

    
    return FeedCenterView;
});
