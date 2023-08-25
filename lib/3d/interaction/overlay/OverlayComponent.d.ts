import { Container } from 'pixi.js';
import type { ComponentInterface } from '../../../core/ComponentInterface';
import type { Entity3D } from '../../core/Entity3D';
/**
 * @param view - A custom Pixi container to be used instaed of the default OverlayComponent view.
 */
export interface OverlayComponentOptions {
    view?: Container;
}
/**
 * Provides the base functionality for a 3D entity that needs 2D overlay elements.
 * For further information on how this is used, see the {@link OverlaySystem}.
 */
export declare class OverlayComponent implements ComponentInterface<OverlayComponentOptions> {
    static DEFAULT_NAME: string;
    /** The Pixi container used as a parent for all the 2D elements needed. */
    view: Container;
    /** The 3D entity this component is attached to. */
    readonly entity: Entity3D;
    constructor(entity: Entity3D, data?: OverlayComponentOptions);
    reset(): void;
    /**
     * Gets whether or not the overlay is currently visible.
     */
    get visible(): boolean;
    /**
     * Sets whether or not the overlay should be visible.
     */
    set visible(value: boolean);
}
//# sourceMappingURL=OverlayComponent.d.ts.map