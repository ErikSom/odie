export class TransformSystem {
    constructor() {
        this.dynamics = 0;
        this.free = 0;
        this._tick = 0;
        this._toUpdate = [];
        this._updateCount = 0;
    }
    render() {
        this._tick++;
        this.dynamics = 0;
        for (let i = 0; i < this._updateCount; i++) {
            this._updateTransform(this._toUpdate[i]);
        }
        this._updateCount = 0;
    }
    /**
     * makes sure that a world transform is up to date setting updateParents to true
     * will make sure the world transform parents are up to date too.
     * updateParents should only be true outside of the render loop
     *
     * @param entity - then entity
     * @param updateParents - should we update parents too
     */
    _updateWorld(entity, updateParents) {
        var _a;
        if (updateParents) {
            this._tick++;
            if ((_a = entity.parent) === null || _a === void 0 ? void 0 : _a.transform) {
                this._updateWorld(entity.parent, true);
            }
        }
        const transform = entity.transform;
        if (this._tick === transform.rTick)
            return;
        transform.rTick = this._tick;
        const parent = entity.parent;
        if (!entity._worldActive)
            return;
        if (!transform.custom) {
            this._updateLocal(transform);
            this.dynamics++;
        }
        if (parent === null || parent === void 0 ? void 0 : parent.transform) {
            this._updateWithParent(transform, parent.transform);
        }
        else {
            transform.worldTransform.copy(transform.localTransform);
        }
    }
    _updateLocal(transform) {
        const quat = transform.quat;
        if (transform.rotationDirty) {
            transform.rotationDirty = false;
            const rx = transform.rotation.x;
            const ry = transform.rotation.y;
            const rz = transform.rotation.z;
            // TODO cache sin cos?
            const c1 = Math.cos(rx / 2);
            const c2 = Math.cos(ry / 2);
            const c3 = Math.cos(rz / 2);
            const s1 = Math.sin(rx / 2);
            const s2 = Math.sin(ry / 2);
            const s3 = Math.sin(rz / 2);
            quat.x = (s1 * c2 * c3) + (c1 * s2 * s3);
            quat.y = (c1 * s2 * c3) - (s1 * c2 * s3);
            quat.z = (c1 * c2 * s3) + (s1 * s2 * c3);
            quat.w = (c1 * c2 * c3) - (s1 * s2 * s3);
        }
        const x = quat.x;
        const y = quat.y;
        const z = quat.z;
        const w = quat.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const out = transform.localTransform.elements;
        const sx = transform.scale['_x'];
        const sy = transform.scale['_y'];
        const sz = transform.scale['_z'];
        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[12] = transform.position['_x'];
        out[13] = transform.position['_y'];
        out[14] = transform.position['_z'];
        transform.currentLocalID = transform.localID;
        // force an update..
        transform.parentID = -1;
        transform.worldID++;
    }
    _updateWithParent(transform, parent) {
        const out = transform.worldTransform.elements;
        const a = parent.worldTransform.elements;
        const b = transform.localTransform.elements;
        if (transform.currentLocalID === 0) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            this.free++;
        }
        else {
            const a00 = a[0];
            const a01 = a[1];
            const a02 = a[2];
            const a10 = a[4];
            const a11 = a[5];
            const a12 = a[6];
            const a20 = a[8];
            const a21 = a[9];
            const a22 = a[10];
            const a30 = a[12];
            const a31 = a[13];
            const a32 = a[14];
            // Cache only the current line of the second matrix
            let b0 = b[0];
            let b1 = b[1];
            let b2 = b[2];
            out[0] = (b0 * a00) + (b1 * a10) + (b2 * a20);
            out[1] = (b0 * a01) + (b1 * a11) + (b2 * a21);
            out[2] = (b0 * a02) + (b1 * a12) + (b2 * a22);
            b0 = b[4];
            b1 = b[5];
            b2 = b[6];
            out[4] = (b0 * a00) + (b1 * a10) + (b2 * a20);
            out[5] = (b0 * a01) + (b1 * a11) + (b2 * a21);
            out[6] = (b0 * a02) + (b1 * a12) + (b2 * a22);
            b0 = b[8];
            b1 = b[9];
            b2 = b[10];
            out[8] = (b0 * a00) + (b1 * a10) + (b2 * a20);
            out[9] = (b0 * a01) + (b1 * a11) + (b2 * a21);
            out[10] = (b0 * a02) + (b1 * a12) + (b2 * a22);
            b0 = b[12];
            b1 = b[13];
            b2 = b[14];
            out[12] = (b0 * a00) + (b1 * a10) + (b2 * a20) + a30;
            out[13] = (b0 * a01) + (b1 * a11) + (b2 * a21) + a31;
            out[14] = (b0 * a02) + (b1 * a12) + (b2 * a22) + a32;
        }
        transform.parentID = parent.worldID;
        // update the id of the transform..
        transform.worldID++;
    }
    _updateTransform(entity) {
        this._updateWorld(entity);
        const children = entity.container.children;
        const length = children.length;
        for (let i = 0; i < length; i++) {
            this._updateTransform(children[i]);
        }
    }
}
TransformSystem.DEFAULT_NAME = 'transform';
