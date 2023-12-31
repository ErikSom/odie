import { Container } from 'pixi.js';
/**
 * Provides the base functionality for a 3D entity that needs 2D overlay elements.
 * For further information on how this is used, see the {@link OverlaySystem}.
 */
export class OverlayComponent {
    constructor(entity, data) {
        this.entity = entity;
        this.view = (data === null || data === void 0 ? void 0 : data.view) || new Container();
    }
    reset() {
        this.view.x = -10000;
        this.view.y = -10000;
    }
    /**
     * Gets whether or not the overlay is currently visible.
     */
    get visible() {
        return this.view.visible;
    }
    /**
     * Sets whether or not the overlay should be visible.
     */
    set visible(value) {
        this.view.visible = value;
    }
}
OverlayComponent.DEFAULT_NAME = 'overlay';
