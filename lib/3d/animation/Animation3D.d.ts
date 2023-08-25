import type { GBTrack } from '@goodboydigital/gb-model-tools';
export interface Animation3DOptions {
    name: string;
    data: TrackData[];
    duration: number;
    loop?: boolean;
    speed?: number;
    currentTime: number;
}
export interface FromAnimationOptions {
    animation: Animation3D;
    name: string;
    start: number;
    end: number;
    speed: number;
    loop: boolean;
}
export interface TrackData {
    duration: number;
    id: number;
    t: GBTrack;
    r: GBTrack;
    s: GBTrack;
    w: GBTrack;
}
export declare class Animation3D {
    name: string;
    duration: number;
    loop: boolean;
    speed: number;
    currentTime: number;
    data: TrackData[];
    /**
     *
     * @param options - data for the Animation initialization
     */
    constructor(options: Animation3DOptions);
    /**
     * Create a new animation by extracting it from an existing one.
     * A lot of our animations are all on one timeline when loaded in. This lets us extract the individual animations
     *
     * Example:
     *
     * ```s
     *  const fps = 24
     *  const runAnimation = Animation.fromAnimation(
     * { name: 'run', start: 10/fps, end: 100/fps, animation: loadedAnimation});
     *
     * ```
     *
     * @param options - data for the Animation initialization
     * @returns the new animation;
     */
    static fromAnimation(options: FromAnimationOptions): Animation3D;
    /**
     * create an Animation object from a generic animation data object (assumed to be a gb animation format)
     *
     * @param animationData - this is usually going to be a loaded gb animation object
     */
    static fromData(animationData: Animation3DOptions): Animation3D;
}
//# sourceMappingURL=Animation3D.d.ts.map