import { Sprite } from 'pixi.js';
import { Animation2D } from './Animation2D';
export class Animator2DComponent {
    constructor(_entity, data) {
        this.init(data);
    }
    init(data) {
        var _a;
        this.view = data.view || new Sprite();
        this.animations = {};
        for (const key in data.animations) {
            const animData = data.animations[key];
            animData.view = this.view;
            this.animations[key] = new Animation2D(animData);
        }
        this.autoUpdate = (_a = data.autoUpdate) !== null && _a !== void 0 ? _a : true;
    }
    /**
     * Adds an animation
     * @param name - name of the animation
     * @param animation - animation to add
     */
    addAnimation(name, animation) {
        animation.view = this.view;
        this.animations[name] = animation;
    }
    /**
     * Stops the current animation on a specific frame
     * @param id - id of the animation
     * @param frameNumber - frame to stop on
     */
    gotoAndStop(frameNumber, id = this._currentAnimationId) {
        var _a;
        if (id !== this._currentAnimationId) {
            (_a = this.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop();
            this._currentAnimationId = id;
        }
        this.currentAnimation.gotoAndStop(frameNumber);
    }
    /**
     * Plays the current animation starting from the specified frame
     * @param id - id of animation
     * @param frameNumber - frame to start on
     */
    gotoAndPlay(frameNumber, id = this._currentAnimationId) {
        var _a;
        if (id !== this._currentAnimationId) {
            (_a = this.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop();
            this._currentAnimationId = id;
        }
        this.currentAnimation.gotoAndPlay(frameNumber);
    }
    /**
     * Plays an animation from its id
     * @param id - id of animation
     * @param force - if true will force the animation to play from the beginning
     */
    play(id, force = false) {
        var _a;
        if (id === this._currentAnimationId && !force)
            return;
        (_a = this.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop();
        this._currentAnimationId = id;
        force ? this.gotoAndPlay(0) : this.currentAnimation.play();
    }
    /** Stops the current animation */
    stop() {
        this.currentAnimation.stop();
    }
    /**
     * Plays a new animation based on the frame of the current animation
     * @param id - id of animation to play
     */
    playOnCurrentFrame(id) {
        this.gotoAndPlay(this.currentAnimation.currentFrame, id);
    }
    update(time) {
        var _a;
        this.autoUpdate && ((_a = this.currentAnimation) === null || _a === void 0 ? void 0 : _a.update(time.frameTime));
    }
    reset() {
        Object.keys(this.animations).forEach((a) => this.animations[a].empty());
        this.animations = {};
        this._currentAnimationId = null;
    }
    empty() {
        this.reset();
    }
    get currentAnimation() {
        return this.animations[this._currentAnimationId];
    }
}
