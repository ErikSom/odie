import type { ComponentInterface } from '../../../core';
import { Euler } from '../../../math/rotation/Euler';
import { Vector3 } from '../../../math/vector/Vector3';
import type { Entity3D } from '../../core';
export interface OrbitalOptions {
    listenerTarget?: HTMLElement | Window;
    radius?: number;
}
export declare class OrbitalComponent implements ComponentInterface {
    static DEFAULT_NAME: string;
    center: Vector3;
    easing: number;
    sensitivity: number;
    sensitivityRotation: number;
    euler: Euler;
    readonly entity: Entity3D;
    private _radius;
    private _targetRadius;
    private _isDown;
    private _isLocked;
    private _isZoomLocked;
    private _rx;
    private _trx;
    private _prevx;
    private _ry;
    private _try;
    private _prevy;
    private _mouseDown;
    private _mouse;
    private readonly _vec;
    private readonly _listenerTarget;
    constructor(entity: Entity3D, data?: OrbitalOptions);
    lock(mValue: boolean): void;
    lockZoom(mValue: boolean): void;
    update(): void;
    private _init;
    private _onWheel;
    private _onDown;
    private _onMove;
    private _onUp;
}
//# sourceMappingURL=OrbitalComponent.d.ts.map