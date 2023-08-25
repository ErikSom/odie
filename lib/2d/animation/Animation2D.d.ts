import type { Sprite } from 'pixi.js';
import { Texture } from 'pixi.js';
export interface Animation2DOptions {
    /** The speed that the AnimatedSprite will play at. Higher is faster, lower is slower. */
    animationSpeed?: number;
    /** Whether or not the animate sprite repeats after playing. */
    loop?: boolean;
    /** Update anchor to Texture's defaultAnchor when frame changes. */
    updateAnchor?: boolean;
    /** textures that make up the animation */
    textures: Texture[];
    /** view to apply textures too */
    view: Sprite;
    /** User-assigned function to call when an AnimatedSprite finishes playing. */
    onComplete?: () => void;
    /** User-assigned function to call when an AnimatedSprite changes which texture is being rendered. */
    onFrameChange?: (currentFrame: number) => void;
    /** User-assigned function to call when `loop` is true, and an AnimatedSprite is played and loops around to start again. */
    onLoop?: () => void;
}
export declare class Animation2D {
    /** textures that make up the animation */
    readonly textures: Texture[];
    /** view to apply textures too */
    view: Sprite;
    /** The speed that the AnimatedSprite will play at. Higher is faster, lower is slower. */
    animationSpeed: number;
    /** Whether or not the animate sprite repeats after playing. */
    loop: boolean;
    /**
     * Update anchor to Texture's defaultAnchor when frame changes.
     * Useful with sprite sheet animations created with tools.
     * Changing anchor for each frame allows to pin sprite origin to certain moving feature of the frame (e.g. left foot).
     * Note: Enabling this will override any previously set `anchor` on each frame change.
     */
    updateAnchor: boolean;
    /** User-assigned function to call when an AnimatedSprite finishes playing. */
    onComplete?: () => void;
    /** User-assigned function to call when an AnimatedSprite changes which texture is being rendered. */
    onFrameChange?: (currentFrame: number) => void;
    /** User-assigned function to call when `loop` is true, and an AnimatedSprite is played and loops around to start again. */
    onLoop?: () => void;
    private _playing;
    /** Elapsed time since animation has been started, used internally to display current texture. */
    private _currentTime;
    /** The texture index that was displayed last timeThe texture index that was displayed last time */
    private _previousFrame;
    /**
     * @param textures - An array of Texture that make up the animation.
     * @param view - Sprite to update texture for
     */
    constructor(data: Animation2DOptions);
    static frameHelper(name: string, numberOfFrames?: number, startFrame?: number, padding?: number): Texture[];
    /** stops the animation */
    stop(): void;
    /** plays the Animation */
    play(): void;
    /**
     * Stops the animation and goes to a specific frame.
     * @param frameNumber - Frame index to stop at.
     */
    gotoAndStop(frameNumber: number): void;
    /**
      * Goes to a specific frame and begins playing the animation.
      * @param frameNumber - Frame index to start at.
      */
    gotoAndPlay(frameNumber: number): void;
    /**
     * Updates the object transform for rendering.
     *
     * @param deltaTime - Time since last tick.
     */
    update(deltaTime: number): void;
    empty(): void;
    /** Updates the displayed texture to match the current frame index. */
    private _updateTexture;
    /** The AnimatedSprites current frame index. */
    get currentFrame(): number;
    /** Indicates if the AnimatedSprite is currently playing */
    get playing(): boolean;
    /** The total number of frames in the AnimatedSprite. This is the same as number of textures assigned to the AnimatedSprite. */
    get totalFrames(): number;
}
//# sourceMappingURL=Animation2D.d.ts.map