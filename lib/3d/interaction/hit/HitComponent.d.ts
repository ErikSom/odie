import { Signal } from 'typed-signals';
import type { ComponentInterface } from '../../../core';
import type { Vector3 } from '../../../math';
import type { Entity3D } from '../../core';
/** type of hit, also used to automatically call signals*/
export declare type interactionType = 'onDown' | 'onUp' | 'onOver' | 'onMove' | 'onOut' | 'onTap';
/** Information retrieved from the hit */
export interface HitInformation {
    /** coordinates in 3D space */
    hit: Vector3;
    /** type of hit*/
    type: interactionType;
}
/** options to pass to the HitComponent */
export interface HitComponentOptions {
    /** set the enable state on creation */
    enabled?: boolean;
    /** when true, objects behind the current interacted object can also be tested */
    passthrough?: boolean;
    /** allow for the mouse state to be changed (like pixi's `buttonMode` parameter) */
    allowMouseTakeover?: boolean;
    /** Set only on instantiation, determines if the children of the entity will be hit tested */
    hitChildren?: boolean;
}
/** Attach to an entity for it to be tested against in the HitSystem */
export declare class HitComponent implements ComponentInterface<HitComponentOptions> {
    /** when true, objects behind the current interacted object can also be tested */
    passthrough: boolean;
    /** signlas for change of interaction state on the entity  */
    readonly signals: Record<string, Signal<(hit: HitInformation) => void>>;
    entity: Entity3D;
    /** allow for the mouse state to be changed (like pixi's `buttonMode` parameter) */
    mouseTakeover: boolean;
    /** Set only on instantiation, determines if the children of the entity will be hit tested */
    readonly hitChildren: boolean;
    /** when false, the attached entity doesn't get checked for hits */
    private _enabled;
    /** for toggling the isOver state */
    private _isOver;
    /** to know if the onMove signal is purely for the use of the onOut or onOver signal */
    private _emptyOnMove;
    constructor(entity: Entity3D, options: HitComponentOptions);
    /** Set the enabled state of the component */
    set enabled(value: boolean);
    /** Get the enabled state of the component */
    get enabled(): boolean;
    on(type: interactionType, callback: (hit: HitInformation) => void): HitComponent;
    off(type: interactionType, callback?: (hit: HitInformation) => void): HitComponent;
    /** Used by the HitSystem to trigger signals,
     ** Devs should not need to call this function */
    onHit(signal: Signal<(hitInfo: HitInformation) => void>, hitInfo: HitInformation): void;
    /** This is called when the mouse is not on the object
     ** Devs should not need to call this function */
    onMiss(): void;
}
//# sourceMappingURL=HitComponent.d.ts.map