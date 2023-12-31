import { Container, DRAW_MODES, QuadUv, RenderTexture, Sprite, State, } from 'pixi.js';
/**
 * A small class for applying a post effect to a texture.
 * the effect will be drawn on to the target texture provided.
 *
 * this is eventually going to power the post processing effects on our scenes
 * but will also allow us to run the effects on any texture we want!
 * for example a reflection texture!
 *
 * still evolving.. but a start
 */
export class ApplyProcessing {
    /**
     *
     * @param w - the width pf the process texture
     * @param h - the height of the process texture
     */
    constructor(w, h, resolution = 1) {
        this.w = w;
        this.h = h;
        this.debugContainer = new Container();
        this._debugSprites = [];
        this._options = {
            width: w,
            height: h,
            resolution,
        };
        this._texturePool = [];
        this._managedTextures = [];
        this._quad = new QuadUv();
        this._defaultState = State.for2d();
    }
    getTexture() {
        let renderTexture = this._texturePool.pop();
        if (!renderTexture) {
            renderTexture = RenderTexture.create(this._options);
            this._managedTextures.push(renderTexture);
            const sprite = new Sprite(renderTexture);
            this.debugContainer.addChild(sprite);
            this._debugSprites.push(sprite);
            this._layoutDebug();
        }
        return renderTexture;
    }
    returnTexture(renderTexture) {
        this._texturePool.push(renderTexture);
    }
    /**
     * apply an effect!
     *
     * @param renderer - an instance of the renderer
     * @param effect - the effect shader to apply the effect
     * @param input - the input texture that will be dranw to the out put with the effect
     * @param output - the output texture that will be written to.
     * @param state - a pixi state to use when applying the effect
     * @param clear - wether to clear the output texture before rendering
     */
    applyEffect(renderer, effect, input, output, state = null, clear = false) {
        effect.uniforms.uSampler = input;
        renderer.renderTexture.bind(output);
        if (clear) {
            renderer.renderTexture.clear([0, 0, 0, 0]);
        }
        renderer.shader.bind(effect, false);
        renderer.state.set(state || this._defaultState);
        renderer.geometry.bind(this._quad);
        renderer.geometry.draw(DRAW_MODES.TRIANGLES);
        renderer.renderTexture.bind(null);
    }
    /**
     * resize the processing textures.
     * @param w - the width pf the process texture
     * @param h - the height of the process texture
     */
    resize(w, h, resolution) {
        resolution = resolution !== null && resolution !== void 0 ? resolution : this._options.resolution;
        if (this.w === w && this.h === h && this._resolution === resolution)
            return;
        this.w = w;
        this.h = h;
        this._resolution = resolution;
        this._options.width = w;
        this._options.height = h;
        this._options.resolution = resolution;
        this._managedTextures.forEach((renderTexture) => {
            renderTexture.setResolution(resolution);
            renderTexture.resize(w, h);
        });
        this._layoutDebug();
    }
    _layoutDebug() {
        this._debugSprites.forEach((sprite, i) => {
            const size = 300;
            const spriteWidth = size;
            const spriteHeight = this.h * (size / this.w);
            sprite.width = spriteWidth;
            sprite.height = spriteHeight;
            sprite.x = i * (size + 1);
        });
    }
}
