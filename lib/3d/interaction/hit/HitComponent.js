import { Signal } from 'typed-signals';
/** Attach to an entity for it to be tested against in the HitSystem */
export class HitComponent {
    constructor(entity, options) {
        var _a, _b, _c, _d;
        /** signlas for change of interaction state on the entity  */
        this.signals = {};
        this.entity = entity;
        this._isOver = false;
        this.enabled = (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true;
        this.passthrough = (_b = options === null || options === void 0 ? void 0 : options.passthrough) !== null && _b !== void 0 ? _b : false;
        this.hitChildren = (_c = options === null || options === void 0 ? void 0 : options.hitChildren) !== null && _c !== void 0 ? _c : false;
        this.mouseTakeover = (_d = options === null || options === void 0 ? void 0 : options.allowMouseTakeover) !== null && _d !== void 0 ? _d : true;
    }
    /** Set the enabled state of the component */
    set enabled(value) {
        this._enabled = value;
    }
    /** Get the enabled state of the component */
    get enabled() {
        return this._enabled;
    }
    on(type, callback) {
        let signal = this.signals[type];
        if (!signal) {
            signal = this.signals[type] = new Signal();
        }
        signal.connect(callback);
        if ((type === 'onOver' || type === 'onOut') && !this.signals['onMove']) {
            this.signals['onMove'] = new Signal();
            this._emptyOnMove = true;
        }
        else if (type === 'onMove') {
            this._emptyOnMove = false;
        }
        return this;
    }
    off(type, callback) {
        const signal = this.signals[type];
        if (!signal)
            return this;
        if (callback) {
            signal.disconnect(callback);
        }
        else {
            signal.disconnectAll();
        }
        if ((type === 'onOver' || type === 'onOut') && this._emptyOnMove) {
            delete this.signals['onMove'];
            this._emptyOnMove = false;
        }
        delete this.signals[type];
        return this;
    }
    /** Used by the HitSystem to trigger signals,
     ** Devs should not need to call this function */
    onHit(signal, hitInfo) {
        var _a;
        this._isOver = true;
        if (hitInfo.type === 'onMove') {
            if (this.mouseTakeover) {
                document.body.style.cursor = 'pointer';
            }
            if (!this._isOver) {
                (_a = this.signals.onOver) === null || _a === void 0 ? void 0 : _a.emit(hitInfo);
            }
            if (this._emptyOnMove)
                return;
        }
        signal === null || signal === void 0 ? void 0 : signal.emit(hitInfo);
    }
    /** This is called when the mouse is not on the object
     ** Devs should not need to call this function */
    onMiss() {
        var _a;
        if (this.mouseTakeover) {
            document.body.style.cursor = 'auto';
        }
        if (this._isOver) {
            (_a = this.signals.onOut) === null || _a === void 0 ? void 0 : _a.emit(null);
        }
        this._isOver = false;
    }
}
