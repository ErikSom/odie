import { Container } from 'pixi.js';
import type { Entity } from '../../../core/Entity';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Scene3D } from '../../core/Scene3D';
/**
 * @param stage - The Pixi container used as a parent for the OverlaySystem view.
 */
export interface OverlaySystemOptions {
    stage: Container;
}
/**
 * A system to map the position of 2D elements to 3D entities in the scene.
 * To register for this system, an enitity needs to have a {@link OverlayComponent}.
 */
export declare class OverlaySystem implements SystemInterface<OverlaySystemOptions> {
    static DEFAULT_NAME: string;
    readonly scene: Scene3D;
    /** The Pixi container used as parent for all the overlay's views. */
    private readonly _view;
    /** A collection of all the overlay components references. */
    private readonly _overlays;
    constructor(_entity: Entity, opts: OverlaySystemOptions);
    /**
     * Called when an entity is added to the game -
     * Store a reference of every OverlayComponent found and adds its view to the main view.
     * @param entity - the entity added to the game
     */
    entityAddedToScene(entity: Entity): void;
    /**
     * Called when an entity is removed from the game -
     * Clears the overlay reference of the entity removed when necessary and removes its view from the main view.
     * @param entity - the entity added to the game
     */
    entityRemovedFromScene(entity: Entity): void;
    reset(): void;
    render(): void;
    /**
     * Extract and map the 2D screen coordinates from the overlay's 3D entity position.
     *
     * @param view3d - a reference to the system used to render the 3D elements of the scene
     * @param overlay - the overlay component to map
     */
    private _mapOverlayViewToEntity;
}
//# sourceMappingURL=OverlaySystem.d.ts.map