import { Euler } from '../../../math/rotation/Euler';
import { Vector3 } from '../../../math/vector/Vector3';
function getCursorPos(e) {
    if (e.touches) {
        e = e;
        return {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
        };
    }
    e = e;
    return {
        x: e.clientX,
        y: e.clientY,
    };
}
export class OrbitalComponent {
    constructor(entity, data = {}) {
        this.entity = entity;
        this._radius = data.radius || 5;
        this._targetRadius = data.radius || 5;
        this._listenerTarget = data.listenerTarget || window;
        this._isDown = false;
        this.center = new Vector3();
        this.easing = 0.1;
        this.sensitivity = 1;
        this.sensitivityRotation = 1;
        this._isLocked = false;
        this._isZoomLocked = false;
        this._rx = 0;
        this._trx = 0;
        this._prevx = 0;
        this._ry = 0;
        this._try = 0;
        this._prevy = 0;
        this._vec = new Vector3();
        this.euler = new Euler(0, 0, 0, 'YXZ');
        this._mouseDown = {
            x: 0,
            y: 0,
        };
        this._mouse = {
            x: 0,
            y: 0,
        };
        this._init();
    }
    lock(mValue) {
        this._isLocked = mValue;
    }
    lockZoom(mValue) {
        this._isZoomLocked = mValue;
    }
    update() {
        const dx = this._mouse.x - this._mouseDown.x;
        const dy = this._mouse.y - this._mouseDown.y;
        const sensitivity = 0.02 * this.sensitivityRotation;
        this._try = this._prevy - (dx * sensitivity);
        this._trx = this._prevx - (dy * sensitivity);
        if (this._trx < (-Math.PI / 2) + 0.01) {
            this._trx = (-Math.PI / 2) + 0.01;
        }
        else if (this._trx > (Math.PI / 2) - 0.01) {
            this._trx = (Math.PI / 2) - 0.01;
        }
        this._rx += (this._trx - this._rx) * this.easing;
        this._ry += (this._try - this._ry) * this.easing;
        this._radius += (this._targetRadius - this._radius) * this.easing;
        const { _vec: vec, euler } = this;
        euler.x = this._rx;
        euler.y = this._ry;
        vec.set(0, 0, this._radius);
        vec.applyEuler(euler);
        this.entity.transform.position.x = this._vec.x;
        this.entity.transform.position.y = this._vec.y;
        this.entity.transform.position.z = this._vec.z;
        this.entity.transform.lookAt(this.center);
    }
    _init() {
        this._listenerTarget.addEventListener('mousedown', (e) => this._onDown(e));
        this._listenerTarget.addEventListener('mouseup', () => this._onUp());
        this._listenerTarget.addEventListener('mousemove', (e) => this._onMove(e));
        this._listenerTarget.addEventListener('touchstart', (e) => this._onDown(e));
        this._listenerTarget.addEventListener('touchend', () => this._onUp());
        this._listenerTarget.addEventListener('touchmove', (e) => this._onMove(e));
        this._listenerTarget.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
    }
    _onWheel(e) {
        if (this._isZoomLocked) {
            return;
        }
        // @ts-ignore yes it does
        const w = e.wheelDelta;
        const d = e.detail;
        let value = 0;
        if (d) {
            if (w) {
                value = w / d / 40 * d > 0 ? 1 : -1; // Opera
            }
            else {
                value = -d / 3; // Firefox;         TODO: do not /3 for OS X
            }
        }
        else {
            value = w / 120;
        }
        this._targetRadius += (-value * 2 * this.sensitivity);
        if (this._targetRadius < 0.01) {
            this._targetRadius = 0.01;
        }
        e.preventDefault();
    }
    _onDown(e) {
        if (this._isLocked) {
            return;
        }
        this._isDown = true;
        this._mouseDown = getCursorPos(e);
        this._mouse = getCursorPos(e);
        this._prevx = this._trx = this._rx;
        this._prevy = this._try = this._ry;
    }
    _onMove(e) {
        if (this._isLocked) {
            return;
        }
        if (!this._isDown) {
            return;
        }
        this._mouse = getCursorPos(e);
    }
    _onUp() {
        if (this._isLocked) {
            return;
        }
        this._isDown = false;
    }
}
OrbitalComponent.DEFAULT_NAME = 'orbital';
OrbitalComponent.DEFAULT_NAME = 'orbital';
