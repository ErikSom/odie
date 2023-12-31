import { Texture } from 'pixi.js';
export class Animation2D {
    /**
     * @param textures - An array of Texture that make up the animation.
     * @param view - Sprite to update texture for
     */
    constructor(data) {
        var _a, _b;
        /** textures that make up the animation */
        this.textures = null;
        /** The speed that the AnimatedSprite will play at. Higher is faster, lower is slower. */
        this.animationSpeed = 1;
        /** Whether or not the animate sprite repeats after playing. */
        this.loop = true;
        /**
         * Update anchor to Texture's defaultAnchor when frame changes.
         * Useful with sprite sheet animations created with tools.
         * Changing anchor for each frame allows to pin sprite origin to certain moving feature of the frame (e.g. left foot).
         * Note: Enabling this will override any previously set `anchor` on each frame change.
         */
        this.updateAnchor = false;
        this._playing = false;
        /** Elapsed time since animation has been started, used internally to display current texture. */
        this._currentTime = 0;
        /** The texture index that was displayed last timeThe texture index that was displayed last time */
        this._previousFrame = null;
        this.textures = data.textures;
        this.view = data.view;
        this.animationSpeed = (_a = data.animationSpeed) !== null && _a !== void 0 ? _a : 1;
        this.loop = (_b = data.loop) !== null && _b !== void 0 ? _b : true;
        this.updateAnchor = data.updateAnchor || false;
        this.onComplete = data.onComplete;
        this.onFrameChange = data.onFrameChange;
        this.onLoop = data.onLoop;
    }
    static frameHelper(name, numberOfFrames = 1, startFrame = 0, padding = 0) {
        const list = [];
        let currentPadding = ''.padStart(padding, '0');
        let increment = Math.pow(10, numberOfFrames.toString().length - 1) * 10;
        for (let i = startFrame; i < numberOfFrames + startFrame; i++) {
            if (i % increment === 0 && i !== 0) {
                currentPadding = currentPadding.slice(0, -1);
                increment *= 10;
            }
            const frame = `${name}${currentPadding}${i}.png`;
            list.push(Texture.from(frame));
        }
        return list;
    }
    /** stops the animation */
    stop() {
        if (!this._playing) {
            return;
        }
        this._playing = false;
    }
    /** plays the Animation */
    play() {
        if (this._playing) {
            return;
        }
        this._playing = true;
    }
    /**
     * Stops the animation and goes to a specific frame.
     * @param frameNumber - Frame index to stop at.
     */
    gotoAndStop(frameNumber) {
        this.stop();
        const previousFrame = this.currentFrame;
        this._currentTime = frameNumber;
        if (previousFrame !== this.currentFrame) {
            this._updateTexture();
        }
    }
    /**
      * Goes to a specific frame and begins playing the animation.
      * @param frameNumber - Frame index to start at.
      */
    gotoAndPlay(frameNumber) {
        const previousFrame = this.currentFrame;
        this._currentTime = frameNumber;
        if (previousFrame !== this.currentFrame) {
            this._updateTexture();
        }
        this.play();
    }
    /**
     * Updates the object transform for rendering.
     *
     * @param deltaTime - Time since last tick.
     */
    update(deltaTime) {
        if (!this._playing) {
            return;
        }
        const elapsed = this.animationSpeed * deltaTime;
        const previousFrame = this.currentFrame;
        this._currentTime += elapsed;
        if (this._currentTime < 0 && !this.loop) {
            this.gotoAndStop(0);
            if (this.onComplete) {
                this.onComplete();
            }
        }
        else if (this._currentTime >= this.textures.length && !this.loop) {
            this.gotoAndStop(this.textures.length - 1);
            if (this.onComplete) {
                this.onComplete();
            }
        }
        else if (previousFrame !== this.currentFrame) {
            if (this.loop && this.onLoop) {
                if (this.animationSpeed > 0 && this.currentFrame < previousFrame) {
                    this.onLoop();
                }
                else if (this.animationSpeed < 0 && this.currentFrame > previousFrame) {
                    this.onLoop();
                }
            }
            this._updateTexture();
        }
    }
    empty() {
        this.stop();
        this.onComplete = null;
        this.onFrameChange = null;
        this.onLoop = null;
    }
    /** Updates the displayed texture to match the current frame index. */
    _updateTexture() {
        const currentFrame = this.currentFrame;
        if (this._previousFrame === currentFrame) {
            return;
        }
        this._previousFrame = currentFrame;
        this.view.texture = this.textures[currentFrame];
        if (this.updateAnchor) {
            this.view.anchor.copyFrom(this.view.texture.defaultAnchor);
        }
        if (this.onFrameChange) {
            this.onFrameChange(this.currentFrame);
        }
    }
    /** The AnimatedSprites current frame index. */
    get currentFrame() {
        let currentFrame = Math.floor(this._currentTime) % this.textures.length;
        if (currentFrame < 0) {
            currentFrame += this.textures.length;
        }
        return currentFrame;
    }
    /** Indicates if the AnimatedSprite is currently playing */
    get playing() {
        return this._playing;
    }
    /** The total number of frames in the AnimatedSprite. This is the same as number of textures assigned to the AnimatedSprite. */
    get totalFrames() {
        return this.textures.length;
    }
}
