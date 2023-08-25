import { Sprite } from 'pixi.js';
import type { ComponentInterface, Entity } from '../..';
import type { Time } from '../../utils';
import type { Animation2DOptions } from './Animation2D';
import { Animation2D } from './Animation2D';
export interface Animator2DComponentOptions {
    /** view that will have its texture changed */
    view?: Sprite;
    /** a record of animation names to options */
    animations?: Record<string, Omit<Animation2DOptions, 'view'>>;
    /** whether or not to automatically update the animation */
    autoUpdate?: boolean;
}
export declare class Animator2DComponent implements ComponentInterface<Animator2DComponentOptions, Entity> {
    data: Animator2DComponentOptions;
    /** view that will have its texture changed */
    view: Sprite;
    /** a record of animation names to animations */
    animations: Record<string, Animation2D>;
    /** whether or not to automatically update the animation */
    autoUpdate: boolean;
    /** the name of the current animation */
    private _currentAnimationId;
    constructor(_entity: Entity, data: Animator2DComponentOptions);
    init(data: Animator2DComponentOptions): void;
    /**
     * Adds an animation
     * @param name - name of the animation
     * @param animation - animation to add
     */
    addAnimation(name: string, animation: Animation2D): void;
    /**
     * Stops the current animation on a specific frame
     * @param id - id of the animation
     * @param frameNumber - frame to stop on
     */
    gotoAndStop(frameNumber: number, id?: string): void;
    /**
     * Plays the current animation starting from the specified frame
     * @param id - id of animation
     * @param frameNumber - frame to start on
     */
    gotoAndPlay(frameNumber: number, id?: string): void;
    /**
     * Plays an animation from its id
     * @param id - id of animation
     * @param force - if true will force the animation to play from the beginning
     */
    play(id: string, force?: boolean): void;
    /** Stops the current animation */
    stop(): void;
    /**
     * Plays a new animation based on the frame of the current animation
     * @param id - id of animation to play
     */
    playOnCurrentFrame(id: string): void;
    update(time: Time): void;
    reset(): void;
    empty(): void;
    get currentAnimation(): Animation2D;
}
//# sourceMappingURL=Animator2DComponent.d.ts.map