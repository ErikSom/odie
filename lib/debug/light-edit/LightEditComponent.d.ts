import type dat from 'dat.gui';
import type { LightEntity } from '../../3d';
import type { ComponentInterface } from '../../core';
export interface LightEditComponentOptions {
    movementRange?: number;
    gui: dat.GUI;
}
/**
 * a light edit component lets you modify a light using the dat gui instance
 * it will modify the transform properties and the light properties
 * also some basic shadow properties
 * Adding a LightSystem will automatically attach this component to all lights in the scene
 */
export declare class LightEditComponent implements ComponentInterface<LightEditComponentOptions, LightEntity> {
    /**
     * reference to the light entity this is attached to
     */
    readonly entity: LightEntity;
    /**
     * reference to the gui that we will be adding variables to
     */
    private readonly _gui;
    /**
     * the movement range of the lights position
     */
    private readonly _movementRange;
    constructor(entity: LightEntity, data: LightEditComponentOptions);
    /**
     * internal function to allow as to use gui color picker
     */
    set lightColor(value: number | string);
    /**
     * internal function to allow as to use gui color picker
     */
    get lightColor(): number | string;
    addedToScene(): void;
}
//# sourceMappingURL=LightEditComponent.d.ts.map