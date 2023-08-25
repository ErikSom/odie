import type { Renderer, RenderTexture } from 'pixi.js';
import { Container, Runner, UniformGroup } from 'pixi.js';
import type { CameraEntity, LightEntity } from '../..';
import type { Entity } from '../../../core/Entity';
import type { Scene } from '../../../core/Scene';
import type { SystemConstructor, SystemInterface } from '../../../core/SystemInterface';
import type { ColorArray } from '../../../math/misc/ColorArray';
import type { Entity3D } from '../Entity3D';
import type { Scene3D } from '../Scene3D';
import { CameraSystem } from './CameraSystem';
import { CullingSystem } from './CullingSystem';
import { EntityRendererSystem } from './EntityRendererSystem';
import type { FogOptions } from './FogSystem';
import { FogSystem } from './FogSystem';
import { LayerSystem } from './LayerSystem';
import { LightSystem } from './LightSystem';
import { WindingSystem } from './WindingSystem';
export interface ViewSubSystemOptions {
    view3d: View3DSystem;
    name?: string;
}
export interface View3DSystemOptions {
    renderer: Renderer;
    fullscreen?: boolean;
    stage?: Container;
    fogOptions?: FogOptions;
    camera?: CameraEntity;
    culling?: boolean;
    /**
     * the conceptual width of the viewport - if you are not full screen, width will automatically be set
     */
    width?: number;
    /**
     * the conceptual height of the viewport - if you are not full screen, height will automatically be set
     */
    height?: number;
    /**
     * true if you want odie to be clever and use geometry instancing where possible!
     */
    instancing?: boolean;
    /**
     * clear the scene before a rendering the 3D scene. Any thing previously rendered in pixi will be cleared!
     */
    clear?: boolean;
    /**
     * the color to clear the context too. this color is a ColorArray, for more control!
     */
    clearColor?: ColorArray;
}
/** All the render information required to call the renderGroup function */
export interface RenderParameters {
    /** The current renderer used by pixi */
    renderer: Renderer;
    /** All lights in the scene */
    lights: LightEntity[];
    /** The current camera used by the View3DSystem */
    camera: CameraEntity;
    /** A list of entities to be ignored in the scene */
    ignoreList?: Entity3D[];
    /** A list of entities to be render in the scene, the rest will be ignored */
    renderList?: Entity3D[];
}
export declare class View3DSystem implements SystemInterface<View3DSystemOptions> {
    static DEFAULT_NAME: string;
    stage: Container;
    container: Container;
    renderer: Renderer;
    globalUniforms: UniformGroup;
    allowInstancing: boolean;
    renderTexture: RenderTexture;
    readonly onRenderBegin: Runner;
    readonly onRenderFinish: Runner;
    readonly onPreDrawScene: Runner;
    readonly entity: Entity;
    readonly scene: Scene3D;
    readonly layers: LayerSystem;
    readonly lights: LightSystem;
    readonly culling: CullingSystem;
    readonly fog: FogSystem;
    readonly entityRenderer: EntityRendererSystem;
    readonly winding: WindingSystem;
    readonly cameraSystem: CameraSystem;
    /**
     * if true will render the scene
     */
    visible: boolean;
    /**
     * if false will apply the scenes container matrix to the scene. It will behave like a normal
     * pixi element. 0,0 of the 3D world becomes the x,y of the pixi container
     * Defaults to true, which means it will fill the screen with 0,0 being the middle of the screen
     */
    fullscreen: boolean;
    private _currentRenderSession;
    /**
     * clear the scene before a rendering the 3D scene. Any thing previously rendered in pixi will be cleared!
     * defaults to false.
     */
    private readonly _clear;
    /**
     * the color to clear the context too. this color is a ColorArray, for more control!
     * defaults to [0,0,0,0]
     */
    private readonly _clearColor;
    constructor(entity: Entity, opts?: View3DSystemOptions);
    addSubSystem<SYSTEM extends SystemInterface<ViewSubSystemOptions, Entity, Scene>>(systemClass: SystemConstructor<any, Entity, Scene, SYSTEM>, options?: any): SYSTEM;
    setCamera(camera: CameraEntity): void;
    get camera(): CameraEntity;
    drawScene(camera: CameraEntity, renderTarget: RenderTexture, renderList?: Entity3D[], ignoreList?: Entity3D[], clear?: boolean, clearColor?: ColorArray): void;
    /**
     * Render and cull a group of entities or a single entity
     * @param renderables - A list of entities or a single entity to render
     * @param renderData - Used to hold multiple bits of information to render objects and effects (i.e. lights)
     */
    renderGroup(renderables: Entity3D[] | Entity3D, renderData: RenderParameters): void;
    addedToScene(scene: Scene): void;
    entityAddedToScene(ent: Entity): void;
    entityRemovedFromScene(ent: Entity): void;
    empty(): void;
    private _renderChildren;
}
//# sourceMappingURL=View3DSystem.d.ts.map