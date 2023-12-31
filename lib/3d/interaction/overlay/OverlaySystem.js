import { Container } from 'pixi.js';
import { Vector2 } from '../../../math/vector/Vector2';
import { Vector3 } from '../../../math/vector/Vector3';
import { OverlayComponent } from './OverlayComponent';
/** A 2D Vector to store the temp position extracted from a 3D position */
const outPos = new Vector2();
/** A 3D Vector to store the temp position to map to a 2D screen position  */
const inPos = new Vector3();
/**
 * A system to map the position of 2D elements to 3D entities in the scene.
 * To register for this system, an enitity needs to have a {@link OverlayComponent}.
 */
export class OverlaySystem {
    constructor(_entity, opts) {
        this._view = new Container();
        this._overlays = new Set();
        if (opts.stage) {
            opts.stage.addChild(this._view);
        }
        else {
            console.warn('no stage provided for overlay system!');
        }
    }
    /**
     * Called when an entity is added to the game -
     * Store a reference of every OverlayComponent found and adds its view to the main view.
     * @param entity - the entity added to the game
     */
    entityAddedToScene(entity) {
        const overlay = entity.getComponent(OverlayComponent);
        if (overlay) {
            this._overlays.add(overlay);
            this._view.addChild(overlay.view);
        }
    }
    /**
     * Called when an entity is removed from the game -
     * Clears the overlay reference of the entity removed when necessary and removes its view from the main view.
     * @param entity - the entity added to the game
     */
    entityRemovedFromScene(entity) {
        const overlay = entity.getComponent(OverlayComponent);
        if (overlay && this._overlays.has(overlay)) {
            this._overlays.delete(overlay);
            this._view.removeChild(overlay.view);
        }
    }
    reset() {
        this._view.removeChildren();
        this._overlays.clear();
    }
    render() {
        const view3d = this.scene.view3d;
        this._overlays.forEach((overlay) => {
            this._mapOverlayViewToEntity(view3d, overlay);
        });
    }
    /**
     * Extract and map the 2D screen coordinates from the overlay's 3D entity position.
     *
     * @param view3d - a reference to the system used to render the 3D elements of the scene
     * @param overlay - the overlay component to map
     */
    _mapOverlayViewToEntity(view3d, overlay) {
        const entity = overlay.entity;
        const view = overlay.view;
        if (overlay.visible) {
            const wt = entity.transform.worldTransform.elements;
            inPos.x = wt[12];
            inPos.y = wt[13];
            inPos.z = wt[14];
            view3d.cameraSystem.map2dFrom3d(outPos, inPos);
            view.x = outPos.x;
            view.y = outPos.y;
        }
    }
}
OverlaySystem.DEFAULT_NAME = 'overlay';
