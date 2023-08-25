import type { BLEND_MODES, Bounds } from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';
import type { Time, XY } from '../../utils';
import type { BehaviourOptions } from './Behaviours';
import type { ParticleParent } from './ParticleComponent';
/** Data that will affect the particle on creation */
export interface CustomParticleData {
    /** texture of particle */
    texture?: string | Texture;
    /** amount that affect the particle's Y velocity over time */
    gravity?: number;
    /** alpha amount on creation */
    customAlpha?: number;
    /** alpha to change to over time */
    targetAlpha?: number;
    /** alpha change per update
     ** will be set to positive number only regardless of value */
    alphaLoss?: number;
    /** tints particle, if array is used, a random tint is used from the array */
    tint?: number | number[];
    /** apply random tint when true, overwrites any given tints */
    randomTint?: boolean;
    /** rotational increment per update */
    angSpeed?: number;
    /** particle blend mode from pixi blend modes */
    blendMode?: BLEND_MODES;
    /** delay before particle's transform is updated */
    transformDelay?: number;
    /** delay before particle's alpha is updated */
    alphaDelay?: number;
    /** target position to move to relative to particle's parent transform */
    target?: XY;
    /** delay before particle attempts to move to target position */
    targetDelay?: number;
    /** determine if the particle will go straight to the target or bypass it slightly beforehand */
    targetExaggeration?: number;
    /** initial scale of the particle */
    scale?: number;
    /** scale transform increment per update, used in sine wave scaling */
    scaleSpeed?: XY;
    /** force of which to expel the particle from its origin position on the X axis */
    forceX?: number;
    /** force of which to expel the particle from its origin position on the Y axis */
    forceY?: number;
    /** determine if origin rotation should be randomised */
    randomRotation?: boolean;
    /** force particles to fire at positive or negative velocity on the X axis */
    forceXDir?: number;
    /** force particles to fire at positive or negative velocity on the Y axis */
    forceYDir?: number;
    /** use default data to produce specific behaviours (can overwrite some custom properties)*/
    behaviour?: string;
    /** options to change how behaviours work*/
    behaviourOptions?: BehaviourOptions;
}
/** A single particle to be created by the particle system */
export declare class Particle {
    /** the sprite that the custom data applies to */
    view?: Sprite;
    /** amount that affect the particle's Y velocity over time */
    gravity?: number;
    /** alpha to change to over time */
    targetAlpha?: number;
    /** data given when creating the particle */
    data: CustomParticleData;
    /** alpha change per update
     * * will be set to positive number only regardless of value
     */
    alphaLoss?: number;
    /** rotational increment per update */
    angSpeed?: number;
    /** delay before particle's transform is updated */
    transformDelay?: number;
    /** delay before particle's alpha is updated */
    alphaDelay?: number;
    /** target position to move to relative to particle's parent transform */
    target?: XY;
    /** delay before particle attempts to move to target position */
    targetDelay: number;
    /** determine if the particle will go straight to the target or bypass it slightly beforehand */
    targetExaggeration: number;
    /** scale transform increment per update, used in sine wave scaling */
    scaleSpeed?: XY;
    /** determines if alpha need to be tweened based on difference between the current alpha and target alpha */
    alphaTween: boolean;
    /** origin scale of the particle */
    mainScale: number;
    /** scale set per update, used in sine wave scaling */
    currentScale: XY;
    /** current velocity used to determine next position every update */
    velocity: XY;
    /** a flag to be set to true once the particle needs to be destroyed */
    isDead: boolean;
    /** bounds to be tested against to determine if particle needs to be killed */
    killBounds: Bounds;
    /** container to hold a particle */
    parent: ParticleParent;
    /** value used to know if current alpha is same as target alpha */
    private _alphaReached;
    constructor();
    /**
     * Assign particle data based on given information
     * * all `data` is optional, there is default values for it all
     * @param data - data that will affect the particle on creation
     */
    create(data?: CustomParticleData): void;
    /**
     * Deal with all aspects of the particle once it is created, including alpha, transform and boundaries
     * @param time - a time class for managing the passage of time from frame to frame within an odie scene
     */
    update(time: Time): void;
    /**
     * Kills self by sending signal to particle system it is associated with
     */
    killSelf(): void;
    /** Set target position for particles to go to */
    setTarget(x: number, y: number): void;
    /**
     * add the particle sprite to a parent container
     * @param container - the container to add the particle to
     */
    addTo(container: ParticleParent): void;
    /**
     * remove the particle sprite from its parent
     */
    removeFromParent(): void;
    /**
     * Deals with setting the transform of the particle based on the pre-defined rules
     * @param delta - delta time
     */
    private _updateTransform;
    /**
     * Deals with setting the alpha of the particle based on the pre-defined rules
     * @param delta - delta time
     */
    private _setAlpha;
    /**
     * If a target is given to the particle, it will move to it once the `targetDelay` is `0`
     * * particle kills self when destination is reached
     * @param delta - delta time
     */
    private _goToTarget;
    /** Determine if particle is within the given bounds
     * * if no bounds are given to particle, then the particle will have no `x` kill zone and a default `y` kill zone of `768`
     * @returns the value to determine if the particle is outside the kill bounds
     */
    private _outOfBounds;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
}
//# sourceMappingURL=Particle.d.ts.map