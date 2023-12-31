/**
 * system that deals with flipping winding!
 *
 * when rendering to a texture, winding order can end up inverted if a camera matrix is flipped.
 * usually this happens when we flip a camera for rendering to a texture.
 * setting this flip will invert winding calls, so business as usual!
 *
 */
export class WindingSystem {
    constructor(_entity, opts) {
        this._flip = false;
        this._renderer = opts.view3d.renderer;
        const gl = this._renderer.gl;
        this._renderer.state['map'][4] = this._renderer.state.setFrontFace = (value) => {
            gl.frontFace(gl[(this._flip !== value) ? 'CW' : 'CCW']);
        };
    }
    /**
     * set to true to invert any gl front face winding
     * false for default
     */
    set flip(value) {
        if (this._flip === value)
            return;
        this._flip = value;
        const renderer = this._renderer;
        const id = !!(renderer.state.stateId & (1 << 4));
        renderer.state.setFrontFace(id);
    }
    get flip() {
        return this._flip;
    }
}
WindingSystem.DEFAULT_NAME = 'winding';
