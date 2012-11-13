var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = (function () {
    function Event() {
        this._listeners = [];
        this._listeners = [];
    }
    Event.prototype.add = function (listener) {
        this._listeners.push(listener);
    };
    return Event;
})();
var ItemSetEvent = (function (_super) {
    __extends(ItemSetEvent, _super);
    function ItemSetEvent() {
        _super.apply(this, arguments);

    }
    ItemSetEvent.prototype.add = function (listener) {
        _super.prototype.add.call(this, listener);
    };
    return ItemSetEvent;
})(Event);