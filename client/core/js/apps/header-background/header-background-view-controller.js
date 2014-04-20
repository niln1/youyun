var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var HeaderBackgroundViewController = (function (_super) {
        __extends(HeaderBackgroundViewController, _super);
        function HeaderBackgroundViewController(View) {
            _super.call(this);
            this._view = View;
        }
        HeaderBackgroundViewController.prototype.collapse = function () {
            $(this._view.el).addClass('closed');
        };

        HeaderBackgroundViewController.prototype.expand = function () {
            $(this._view.el).removeClass('closed');
        };
        return HeaderBackgroundViewController;
    })(Marionette.Controller);

    
    return HeaderBackgroundViewController;
});
