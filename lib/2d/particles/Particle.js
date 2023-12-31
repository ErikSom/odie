import { Point, Sprite, Texture } from 'pixi.js';
import { lerp } from '../../math';
/** A single particle to be created by the particle system */
export class Particle {
    constructor() {
        this.isDead = false;
        this.velocity = new Point();
        this.view = new Sprite(Texture.WHITE);
    }
    /**
     * Assign particle data based on given information
     * * all `data` is optional, there is default values for it all
     * @param data - data that will affect the particle on creation
     */
    create(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.data = data;
        let texture = Texture.WHITE;
        if (data.texture) {
            texture = typeof data.texture === 'string' ? Texture.from(data.texture) : data.texture;
        }
        const sprite = this.view;
        sprite.texture = texture;
        this.gravity = (_a = data.gravity) !== null && _a !== void 0 ? _a : 9.8;
        sprite.alpha = (_b = data.customAlpha) !== null && _b !== void 0 ? _b : 1;
        this.targetAlpha = (_c = data.targetAlpha) !== null && _c !== void 0 ? _c : sprite.alpha;
        this.alphaTween = sprite.alpha !== this.targetAlpha;
        let tint = 0xffffff;
        if (data.randomTint) {
            tint = Math.floor(Math.random() * 16777215);
        }
        else if (data.tint) {
            tint = Array.isArray(data.tint)
                ? data.tint[Math.floor(Math.random() * data.tint.length)] : data.tint;
        }
        sprite.tint = tint;
        this.alphaLoss = (_d = Math.abs(data.alphaLoss)) !== null && _d !== void 0 ? _d : 0.1;
        this.angSpeed = (_e = data.angSpeed) !== null && _e !== void 0 ? _e : 0;
        sprite.rotation = data.randomRotation ? Math.random() * Math.PI : 0;
        sprite.anchor.set(0.5);
        sprite.scale.set(1);
        sprite.blendMode = (_f = data.blendMode) !== null && _f !== void 0 ? _f : 0;
        this.transformDelay = (_g = data.transformDelay) !== null && _g !== void 0 ? _g : 0;
        this.alphaDelay = (_h = data.alphaDelay) !== null && _h !== void 0 ? _h : 0;
        const scl = data.scale || 0.03;
        this.target = data.target;
        this.targetDelay = (_j = data.targetDelay) !== null && _j !== void 0 ? _j : 0;
        this.targetExaggeration = (_k = data.targetExaggeration) !== null && _k !== void 0 ? _k : 1;
        this.mainScale = 300 / (sprite.height * sprite.scale.y) * (scl);
        sprite.scale.set(this.mainScale);
        this.scaleSpeed = {
            x: (_m = (_l = data === null || data === void 0 ? void 0 : data.scaleSpeed) === null || _l === void 0 ? void 0 : _l.x) !== null && _m !== void 0 ? _m : 0,
            y: (_p = (_o = data === null || data === void 0 ? void 0 : data.scaleSpeed) === null || _o === void 0 ? void 0 : _o.y) !== null && _p !== void 0 ? _p : 0,
        };
        this.currentScale = new Point();
        const forceX = (_q = data.forceX) !== null && _q !== void 0 ? _q : 20;
        const forceY = (_r = data.forceY) !== null && _r !== void 0 ? _r : 20;
        this.velocity.x = (Math.random() - 0.5) * forceX;
        this.velocity.y = (Math.random() - 0.5) * forceY;
        if (data.forceXDir) {
            this.velocity.x = (data.forceXDir > 0) ? Math.abs(this.velocity.x) : -Math.abs(this.velocity.x);
        }
        if (data.forceYDir) {
            this.velocity.y = (data.forceYDir > 0) ? Math.abs(this.velocity.y) : -Math.abs(this.velocity.y);
        }
        this._alphaReached = false;
        this.isDead = false;
    }
    /**
     * Deal with all aspects of the particle once it is created, including alpha, transform and boundaries
     * @param time - a time class for managing the passage of time from frame to frame within an odie scene
     */
    update(time) {
        const delta = time.frameTime;
        if (this.transformDelay <= 0) {
            this._updateTransform(delta);
            if (this.target) {
                this._goToTarget(delta);
            }
            else {
                this.velocity.y += this.gravity * (delta / 60);
            }
        }
        else {
            this.transformDelay -= delta;
        }
        if (this.alphaDelay <= 0) {
            this._setAlpha(delta);
        }
        else {
            this.alphaDelay -= delta;
        }
        if (this.view.alpha <= 0 || this._outOfBounds()) {
            this.killSelf();
        }
    }
    /**
     * Kills self by sending signal to particle system it is associated with
     */
    killSelf() {
        this.isDead = true;
    }
    /** Set target position for particles to go to */
    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
    }
    /**
     * add the particle sprite to a parent container
     * @param container - the container to add the particle to
     */
    addTo(container) {
        container.addChild(this.view);
        this.parent = container;
    }
    /**
     * remove the particle sprite from its parent
     */
    removeFromParent() {
        if (!this.parent)
            return;
        this.parent.removeChild(this.view);
    }
    /**
     * Deals with setting the transform of the particle based on the pre-defined rules
     * @param delta - delta time
     */
    _updateTransform(delta) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        const sprite = this.view;
        sprite.rotation += this.angSpeed * delta;
        if (this.scaleSpeed.x !== 0) {
            this.currentScale.x += this.scaleSpeed.x * delta;
            this.view.scale.x = Math.sin(this.currentScale.x) * this.mainScale;
        }
        if (this.scaleSpeed.y !== 0) {
            this.currentScale.y += this.scaleSpeed.y * delta;
            this.view.scale.y = Math.sin(this.currentScale.y) * this.mainScale;
        }
    }
    /**
     * Deals with setting the alpha of the particle based on the pre-defined rules
     * @param delta - delta time
     */
    _setAlpha(delta) {
        if (this._alphaReached)
            return;
        const sprite = this.view;
        if (!this.alphaTween) {
            sprite.alpha -= delta * this.alphaLoss;
        }
        else {
            const dir = -Math.sign(sprite.alpha - this.targetAlpha);
            sprite.alpha += (delta * this.alphaLoss) * dir;
            if ((dir > 0 && sprite.alpha >= this.targetAlpha) || (dir < 0 && sprite.alpha <= this.targetAlpha)) {
                sprite.alpha = this.targetAlpha;
                this._alphaReached = true;
            }
        }
    }
    /**
     * If a target is given to the particle, it will move to it once the `targetDelay` is `0`
     * * particle kills self when destination is reached
     * @param delta - delta time
     */
    _goToTarget(delta) {
        this.targetDelay -= delta;
        if (this.targetDelay <= 0) {
            const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            const targetX = Math.cos(angle) * this.targetExaggeration;
            const targetY = Math.sin(angle) * this.targetExaggeration;
            this.velocity.x = lerp(this.velocity.x, targetX, 0.05);
            this.velocity.y = lerp(this.velocity.y, targetY, 0.05);
            const dist = Math.sqrt(Math.pow((this.x - this.target.x), 2) + Math.pow((this.y - this.target.y), 2));
            const sprite = this.view;
            if (dist < sprite.height * 0.5) {
                this.killSelf();
            }
        }
    }
    /** Determine if particle is within the given bounds
     * * if no bounds are given to particle, then the particle will have no `x` kill zone and a default `y` kill zone of `768`
     * @returns the value to determine if the particle is outside the kill bounds
     */
    _outOfBounds() {
        let kill = true;
        if (this.killBounds) {
            if (this.x < this.killBounds.maxX && this.x > this.killBounds.minX
                && this.y < this.killBounds.maxY && this.y > this.killBounds.minY) {
                kill = false;
            }
        }
        else if (this.y < 768) {
            kill = false;
        }
        return kill;
    }
    get x() { return this.view.x; }
    set x(value) { this.view.x = value; }
    get y() { return this.view.y; }
    set y(value) { this.view.y = value; }
}
