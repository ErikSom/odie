import { Container } from 'pixi.js';
import type { Entity } from '../../../core';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { XY } from '../../../utils';
import type { Entity2D } from '../Entity2D';
import type { Scene2D } from '../Scene2D';
export interface View2DSystemOptions {
    stage?: Container;
}
export interface ICamera extends XY {
    zoom: number;
    offset: XY;
}
export declare class View2DSystem implements SystemInterface<View2DSystemOptions> {
    static DEFAULT_NAME: string;
    w: number;
    h: number;
    scene: Scene2D;
    camera: ICamera;
    readonly stage: Container;
    private readonly _activeItemsContainer;
    private readonly _layers;
    private readonly _innerContainer;
    constructor(_entity: Entity, opts?: View2DSystemOptions);
    setCamera(camera: ICamera): void;
    render(): void;
    entityAddedToScene(ent: Entity): void;
    entityRemovedFromScene(ent: Entity): void;
    empty(): void;
    addLayer(id: string, index?: number): void;
    /**
     * Changes an entities layer
     * @param entity - entity to swap layer
     * @param newLayer - id of layer to swap too
     * @param depth - depth to add the entity at
     */
    setEntityLayer(entity: Entity2D, newLayer: string, depth?: number): void;
    /**
     * Sets a layer to a specific index
     * @param layerName - name of the layer
     * @param index - index to add the layer at
     */
    setLayerAt(layerName: string, index: number): void;
    resize(w: number, h: number): void;
    get layers(): Record<string, Container>;
    get activeItemsContainer(): Container;
    get innerContainer(): Container;
}
//# sourceMappingURL=View2DSystem.d.ts.map