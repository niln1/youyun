var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './B'], function(require, exports, B) {
    var A = (function (_super) {
        __extends(A, _super);
        function A() {
            _super.apply(this, arguments);
        }
        A.prototype.testA = function () {
        };
        return A;
    })(B);

    
    return A;
});
