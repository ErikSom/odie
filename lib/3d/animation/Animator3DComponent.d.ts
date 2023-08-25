import { Signal } from 'typed-signals';
import type { ComponentInterface } from '../../core/ComponentInterface';
import type { Time } from '../../utils/Time';
import type { Entity3D } from '../core/Entity3D';
import { Animation3D } from './Animation3D';
export interface Animator3DOptions {
    fps?: number;
    clips?: Record<string, {
        frames?: [number, number];
        loop?: boolean;
        speed?: number;
    }>;
    mixes?: [string, string, number][];
    animations: Animation3D[];
    autoUpdate?: boolean;
}
export declare class Animator3DComponent implements ComponentInterface {
    static DEFAULT_NAME: string;
    readonly signals: {
        animationComplete: Signal<(name: string) => void>;
    };
    allowMixing: boolean;
    mixAmount: number;
    animation: Animation3D;
    lastAnimation: Animation3D;
    autoUpdate: boolean;
    readonly entity: Entity3D;
    private _nextAnimation;
    private _mixedMap;
    private _animations;
    private _animationTick;
    private _lastAnimationTick;
    private _mixRatio;
    private _mixing;
    private readonly _defaultMix;
    /**
     * A lot of the time we will be loading single master animations that need to be broken up.
     * To break up an animation please provide a clips object. Animations will be generated from this.
     * The expected format is the following:
     * ```
     * {
     *     fps:24 // the frame rate of the animation
     *     clips: {
     *        run: { frames: [960, 970], loop: true, speed: 0.02 }, // start frame and end frame
     *        roll: { frames: [151, 164], speed: 0.04 },
     *     },
     *     mixes:[
     *         ['run', 'roll', 0.012],
     *         ['roll', 'run', 0.006],
     *     ],
     * }
     *
     * // you can then play an animation like so:
     *
     * myScene.animationController.play('run');
     *
     * ```
     *
     * On complete animations will trigger the 'animationComplete' typed signal. This is accessible via:
     * AnimationControllerComponent.signals.onAnimationComplete.add()
     * This signal is dispatched with the animation name string parameter
     *
     * @param entity - an odie entity the component will be attached to
     * @param data - additional animation information
     *
     */
    constructor(entity: Entity3D, data: Animator3DOptions);
    /**
     * plays an animation
     * @param name - the name of the animation to play, this must exist in the animations object
     * @param restart - forces to restart the animation if the same one is already playing
     */
    play(name: string, restart?: boolean): void;
    /**
     * Set the transition duration for a specific combination of animations.
     *
     * @param animation1 - first animation id
     * @param animation2 - second animation id
     * @param duration - number in seconds that it should take to transition from one animation to the next
     */
    setMix(animation1: string, animation2: string, duration: number): void;
    update(time: Time): void;
    /**
     * Render current state, without changing time
     */
    render(): void;
    /**
     * Update animation position/state, without rendering it
     * @param step - The delta multiplier for the update, usually 0 to 1
     */
    updateAnimation(step?: number): void;
    private _playNextAnimation;
    /**
     * Applies a pose from a single animation based on the time provided
     *
     * @param animation - the animation to apply to the entity
     * @param time - time in seconds of the animation to apply
     */
    private _applySingleAnimation;
    /**
     * Mix two animations together with a specified ratio
     *
     * @param entity - the entity to apply the animations to
     * @param animation1 - the first animation to mix
     * @param time1 - time in seconds of the first animation pose
     * @param animation2 - the second animation to mix
     * @param time2 - time in seconds of the second animation
     * @param ratio - mix ratio between 0 and 1
     */
    private _applyTwoAnimations;
    /**
     * used to find the value of a vector at a specific point in time on a track
     * this will interpolated between frames
     *
     * @param times - array of keyframe times
     * @param values - array of keyframe values
     * @param time - the time in seconds to find the value of the vec3
     * @param interpolateLoop - if true will ensure that the animation will loop smoothly
     * (set to true for looping animations)
     * @param result - a vec3 that the data will be written to.
     */
    private _interpolateVec3;
    private _interpolateArray;
    /**
     * used to find the value of a quad at a specific point in time on a track
     * this will interpolated between frames
     *
     * @param times - array of keyframe times
     * @param values - array of keyframe values
     * @param time - the time in seconds to find the value of the quad
     * @param interpolateLoop - if true will ensure that the animation will loop smoothly
     * (set to true for looping animations)
     * @param result - a quat that the data will be written to.
     */
    private _interpolateQuat;
    /**
     * Figures out what the time should be whether the animation needs to loop or not.
     *
     * @param animation - the animation object to read times from
     * @param time - the current time
     * @returns the new time to apply to the animation
     */
    private _updateAnimationTime;
}
//# sourceMappingURL=Animator3DComponent.d.ts.map