import type { Renderer, Shader } from 'pixi.js';
import { Container, RenderTexture, State } from 'pixi.js';
import type { SystemInterface } from '../../core/SystemInterface';
import type { Entity3D } from '../core';
export interface PostProcessingSystemOptions {
    stage: Container;
    enabled?: boolean;
    /**
     * true if you want the scene to make use of the stencil buffer. false by default
     * enable if you are using the masking system
     */
    stencil?: boolean;
    /**
     * true if you want the scene to be rendered to a depth texture too. false by default
     * used for things like depth of field blur
     */
    depth?: boolean;
    /**
     * a custom render function to apply effects
     */
    render: (renderer: Renderer, scope: any) => void;
}
export declare class PostProcessingSystem implements SystemInterface<PostProcessingSystemOptions> {
    static DEFAULT_NAME: string;
    w: number;
    h: number;
    renderTexture: RenderTexture;
    private readonly _sprite;
    private _enabled;
    private readonly _quad;
    private readonly _defaultState;
    private readonly _stage;
    private readonly _renderable;
    private _view3d;
    constructor(entity: Entity3D, options: PostProcessingSystemOptions);
    applyEffect(renderer: Renderer, effect: Shader, input: RenderTexture, output: RenderTexture, state?: State, clear?: boolean): void;
    resize(w: number, h: number): void;
    get enabled(): boolean;
    set enabled(value: boolean);
}
//# sourceMappingURL=PostProcessingSystem.d.ts.map