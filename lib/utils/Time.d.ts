interface TimeOptions {
    timeScale?: number;
    fps?: number;
}
/**
 * a time class for managing the passage of time from frame to frame within an odie scene.
 */
export declare class Time {
    /**
     * the time modifier that defaults to one. Speed up or slow down time
     * by modifying this value
     */
    timeScale: number;
    /**
     * the target FPS for this game. 60fps is the default as thats what most devices hit
     */
    fps: number;
    /**
     * the maximum size a delta step can be. 20fps. If your game runs slower than this.. this
     * we are doing something wrong!
     */
    maxDeltaTime: number;
    private _lastTime;
    private readonly _frameDuration;
    private _deltaTime;
    private _frameTime;
    constructor(options?: TimeOptions);
    /**
     * call at the start of the game update loop in the scene
     */
    nextUpdate(): void;
    /**
     * the time elapsed from the previous frame in milliseconds
     */
    get deltaTime(): number;
    /**
     * the time elapsed from the previous frame in milliseconds
     * does not take into account the time scale
     */
    get unscaledDeltaTime(): number;
    /**
     * the time elapsed from the previous frame in frames.
     * a value around one indicates we are matching the frame rate
     */
    get frameTime(): number;
    /**
     * the time elapsed from the previous frame in frames.
     * a value around one indicates we are matching the frame rate
     * does not take into account the time scale
     */
    get unscaledFrameTime(): number;
}
export {};
//# sourceMappingURL=Time.d.ts.map