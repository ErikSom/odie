/**
 * a time class for managing the passage of time from frame to frame within an odie scene.
 */
export class Time {
    constructor(options = {}) {
        var _a, _b;
        /**
         * the time modifier that defaults to one. Speed up or slow down time
         * by modifying this value
         */
        this.timeScale = 1;
        /**
         * the target FPS for this game. 60fps is the default as thats what most devices hit
         */
        this.fps = 60;
        /**
         * the maximum size a delta step can be. 20fps. If your game runs slower than this.. this
         * we are doing something wrong!
         */
        this.maxDeltaTime = 1000 / 20;
        this._deltaTime = 0;
        this._frameTime = 0;
        this.timeScale = (_a = options.timeScale) !== null && _a !== void 0 ? _a : 1;
        this.fps = (_b = options.fps) !== null && _b !== void 0 ? _b : 60;
        this._lastTime = performance.now();
        this._frameDuration = 1000 / this.fps;
    }
    /**
     * call at the start of the game update loop in the scene
     */
    nextUpdate() {
        const now = performance.now();
        this._deltaTime = Math.min(now - this._lastTime, this.maxDeltaTime);
        this._frameTime = this._deltaTime / this._frameDuration;
        this._lastTime = now;
    }
    /**
     * the time elapsed from the previous frame in milliseconds
     */
    get deltaTime() {
        return this._deltaTime * this.timeScale;
    }
    /**
     * the time elapsed from the previous frame in milliseconds
     * does not take into account the time scale
     */
    get unscaledDeltaTime() {
        return this._deltaTime;
    }
    /**
     * the time elapsed from the previous frame in frames.
     * a value around one indicates we are matching the frame rate
     */
    get frameTime() {
        return this._frameTime * this.timeScale;
    }
    /**
     * the time elapsed from the previous frame in frames.
     * a value around one indicates we are matching the frame rate
     * does not take into account the time scale
     */
    get unscaledFrameTime() {
        return this._frameTime;
    }
}
