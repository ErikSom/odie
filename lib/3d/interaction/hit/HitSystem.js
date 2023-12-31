import { Point } from 'pixi.js';
import { Matrix4 } from '../../../math/matrix/Matrix4';
import { Ray } from '../../../math/misc/Ray';
import { Vector3 } from '../../../math/vector/Vector3';
import { HitComponent } from './HitComponent';
const v3 = new Vector3();
const v4 = new Vector3();
const tempMat = new Matrix4();
const tempMat2 = new Matrix4();
function findAllView3D(entity, out = []) {
    const children = entity.container.children;
    out.push(entity);
    for (let i = 0; i < children.length; i++) {
        findAllView3D(children[i], out);
    }
    return out;
}
function generateRay(mCamera, mScreenPosition, mRay) {
    const mInverseViewProj = tempMat;
    const cameraDir = v3;
    const proj = mCamera.camera.projection;
    const view = mCamera.camera.view;
    const invertView = tempMat2.getInverse(view);
    const position = invertView.extractPosition(v4);
    mInverseViewProj.multiplyMatrices(proj, view)
        .getInverse(mInverseViewProj);
    cameraDir.copy(mScreenPosition)
        .applyMatrix4(mInverseViewProj)
        .sub(position)
        .normalize();
    if (!mRay) {
        mRay = new Ray(position, cameraDir);
    }
    else {
        mRay.set(position, cameraDir);
    }
    return mRay;
}
export class HitSystem {
    constructor(_entity, opts) {
        var _a;
        this._connected = false;
        this._firstPos = new Point();
        this._lastPos = new Point();
        this._itemsToTest = new Map();
        this._interactiveEntities = new Map();
        if (opts.hitArea) {
            this.setHitArea(opts.hitArea);
        }
        else {
            console.error('No hitArea set for HitSystem');
        }
        if (!opts.hitArea.parent) {
            opts.stage.addChild(opts.hitArea);
        }
        this._ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
        this.tapThreshold = (_a = opts.tapThreshold) !== null && _a !== void 0 ? _a : 2;
    }
    setHitArea(area) {
        this._hitArea = area;
    }
    connect() {
        if (this._hitArea && !this._connected) {
            this._connected = true;
            this._hitArea.on('pointerdown', this._onDown, this);
            this._hitArea.on('pointermove', this._onMove, this);
            this._hitArea.on('pointerup', this._onUp, this);
            this._hitArea.on('pointertap', this._onTap, this);
        }
    }
    disconnect() {
        if (this._hitArea && this._connected) {
            this._connected = false;
            this._hitArea.off('pointerdown', this._onDown);
            this._hitArea.off('pointermove', this._onMove);
            this._hitArea.off('pointerup', this._onUp);
            this._hitArea.off('pointertap', this._onTap);
        }
    }
    start() {
        const view3d = this.scene.view3d;
        this._renderer = view3d.renderer;
        this.connect();
    }
    entityAddedToScene(ent) {
        const entity = ent;
        const hit = entity.getComponent(HitComponent);
        if (hit) {
            if (hit.hitChildren) {
                const items = findAllView3D(entity);
                this._itemsToTest.set(entity.UID, items);
            }
            else {
                this._itemsToTest.set(entity.UID, [entity]);
            }
            this._interactiveEntities.set(entity.UID, entity);
        }
    }
    entityRemovedFromScene(ent) {
        const entity = ent;
        if (this._itemsToTest.has(entity.UID)) {
            this._interactiveEntities.delete(entity.UID);
            this._itemsToTest.delete(entity.UID);
        }
    }
    _onDown(e) {
        this._firstPos.copyFrom(e.data.global);
        this._processEvent('onDown');
    }
    _onMove(e) {
        this._lastPos.copyFrom(e.data.global);
        this._processEvent('onMove');
    }
    _onUp(e) {
        this._lastPos.copyFrom(e.data.global);
        this._processEvent('onUp');
    }
    _onTap() {
        const dx = Math.abs(this._firstPos.x - this._lastPos.x);
        const dy = Math.abs(this._firstPos.y - this._lastPos.y);
        if (dx > this.tapThreshold || dy > this.tapThreshold)
            return;
        this._processEvent('onTap');
    }
    _processEvent(type) {
        let hit;
        let passthrough;
        this._interactiveEntities.forEach((entity, key) => {
            const interactive = entity.getComponent(HitComponent);
            if (!entity.active || (!!hit && !passthrough) || !interactive.enabled)
                return;
            passthrough = interactive.passthrough;
            const items = this._itemsToTest.get(key);
            const signal = interactive.signals[type];
            if (signal) {
                hit = this._checkHit(items);
                if (hit) {
                    interactive.onHit(signal, { type, hit });
                }
                else {
                    interactive.onMiss();
                }
            }
        });
    }
    _checkHit(entitiesToTest) {
        const camera = this.scene.view3d.camera;
        if (!camera) {
            console.error('There is no camera set');
            return null;
        }
        let { width, height } = this._renderer.view;
        width /= this._renderer.resolution;
        height /= this._renderer.resolution;
        const mx = ((this._lastPos.x / width) * 2.0) - 1.0;
        const my = -((this._lastPos.y / height) * 2.0) + 1.0;
        generateRay(camera, new Vector3(mx, my, 0), this._ray);
        for (let i = 0; i < entitiesToTest.length; i++) {
            const hitObject = entitiesToTest[i];
            const hit = this._ray.intersectsEntity(hitObject);
            if (hit) {
                return hit;
            }
        }
        return null;
    }
}
HitSystem.DEFAULT_NAME = 'hit';
