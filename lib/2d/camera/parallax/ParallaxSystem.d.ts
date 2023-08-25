import type { Point, TilingSprite } from 'pixi.js';
import { Container } from 'pixi.js';
import type { Entity } from '../../../core';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Dimensions, Time } from '../../../utils';
export interface ParallaxSystemOptions {
    container: Container;
}
export declare class ParallaxSystem implements SystemInterface<ParallaxSystemOptions> {
    static DEFAULT_NAME: string;
    currentAnchor: Point;
    currentZoom: number;
    offset: Point;
    velocity: Point;
    size: Dimensions;
    private readonly _opts;
    private _layers;
    private _parallaxContainer;
    constructor(_entity: Entity, opts: ParallaxSystemOptions);
    addImageLayer(layerName: string, image: TilingSprite, depth?: number, scale?: number): void;
    updateBounds(w: number, h: number): void;
    update(time: Time): void;
    reset(): void;
    setScale(zoom: number): void;
    setParallaxAnchor(anchor: Point): void;
    setVelocity(x?: number, y?: number): void;
    setOffset(x?: number, y?: number): void;
    private _lerp;
}
//# sourceMappingURL=ParallaxSystem.d.ts.map