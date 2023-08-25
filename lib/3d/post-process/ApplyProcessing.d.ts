import type { Renderer, Shader } from 'pixi.js';
import { Container, RenderTexture, State } from 'pixi.js';
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
export declare class ApplyProcessing {
    w: number;
    h: number;
    renderTexture: RenderTexture;
    enabled: boolean;
    readonly debugContainer: Container;
    private readonly _debugSprites;
    private _resolution;
    private readonly _defaultState;
    private readonly _texturePool;
    private readonly _managedTextures;
    private readonly _quad;
    private _options;
    /**
     *
     * @param w - the width pf the process texture
     * @param h - the height of the process texture
     */
    constructor(w: number, h: number, resolution?: number);
    getTexture(): RenderTexture;
    returnTexture(renderTexture: RenderTexture): void;
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
    applyEffect(renderer: Renderer, effect: Shader, input: RenderTexture, output: RenderTexture, state?: State, clear?: boolean): void;
    /**
     * resize the processing textures.
     * @param w - the width pf the process texture
     * @param h - the height of the process texture
     */
    resize(w: number, h: number, resolution?: number): void;
    private _layoutDebug;
}
//# sourceMappingURL=ApplyProcessing.d.ts.map