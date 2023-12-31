import { Container, DRAW_MODES, QuadUv, RenderTexture, Sprite, State } from 'pixi.js';
import { View3DSystem } from '../core';
export class PostProcessingSystem {
    constructor(entity, options) {
        this._enabled = false;
        this.w = -1;
        this.h = -1;
        const renderTextureOptions = {
            width: 10,
            height: 10,
            resolution: 1,
        };
        this.renderTexture = RenderTexture.create(renderTextureOptions);
        this._view3d = entity.getComponent(View3DSystem);
        this._stage = options.stage;
        this._sprite = new Sprite(this.renderTexture);
        this._renderable = new Container();
        this.enabled = options.enabled || true;
        if (options.stencil) {
            this.renderTexture.baseTexture.framebuffer.enableStencil();
            if (options.depth) {
                console.warn('WebGL cannot use depth texture and stencil buffer at tthe same time, depth is disabled');
            }
        }
        else if (options.depth) {
            this.renderTexture.baseTexture.framebuffer.addDepthTexture();
        }
        this._quad = new QuadUv();
        const state = new State();
        state.blend = false;
        this._defaultState = state;
        this._renderable.render = (renderer) => {
            options.render(renderer, this);
        };
    }
    applyEffect(renderer, effect, input, output, state = null, clear = false) {
        effect.uniforms.uSampler = input;
        renderer.renderTexture.bind(output);
        if (clear) {
            renderer.renderTexture.clear();
        }
        renderer.shader.bind(effect, false);
        renderer.state.set(state || this._defaultState);
        renderer.geometry.bind(this._quad);
        renderer.geometry.draw(DRAW_MODES.TRIANGLE_STRIP);
    }
    resize(w, h) {
        this.w = w;
        this.h = h;
        this.renderTexture.resize(w, h);
        this.renderTexture.setResolution(this._view3d.renderer.resolution);
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (this._enabled === value)
            return;
        this._enabled = value;
        if (value) {
            this._stage.addChild(this._renderable);
            this._stage.addChild(this._sprite);
            this._view3d.renderTexture = this.renderTexture;
        }
        else {
            this._stage.removeChild(this._renderable);
            this._stage.removeChild(this._sprite);
            this._view3d.renderTexture = null;
        }
    }
}
PostProcessingSystem.DEFAULT_NAME = 'postProcessing';
