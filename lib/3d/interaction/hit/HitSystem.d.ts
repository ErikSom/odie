import type { Container } from 'pixi.js';
import type { Entity } from '../../../core/Entity';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Scene3D } from '../../core';
export interface HitSystemOptions {
    stage: Container;
    hitArea?: Container;
    tapThreshold?: number;
}
export declare class HitSystem implements SystemInterface<HitSystemOptions> {
    static DEFAULT_NAME: string;
    readonly scene: Scene3D;
    tapThreshold: number;
    private _renderer;
    private _hitArea;
    private _connected;
    private readonly _itemsToTest;
    private readonly _interactiveEntities;
    private readonly _ray;
    private readonly _firstPos;
    private readonly _lastPos;
    constructor(_entity: Entity, opts: HitSystemOptions);
    setHitArea(area: Container): void;
    connect(): void;
    disconnect(): void;
    start(): void;
    entityAddedToScene(ent: Entity): void;
    entityRemovedFromScene(ent: Entity): void;
    private _onDown;
    private _onMove;
    private _onUp;
    private _onTap;
    private _processEvent;
    private _checkHit;
}
//# sourceMappingURL=HitSystem.d.ts.map