import type { GBObject } from '@goodboydigital/gb-model-tools';
import type { Shader } from 'pixi.js';
import { Entity3D } from '../../3d/core/Entity3D';
import { Geometry3D } from '../../3d/geometry/Geometry3D';
import { GeometryFragment } from '../../3d/geometry/GeometryFragment';
export interface SceneOptions {
    /**
     * the layer in which the the scene will be rendered. The value of this layer is more to help grouping of
     * objects for rendering and lets you execute code before and after a layer is rendered.
     */
    layerId?: string;
    /**
     * the mask is an array of types that you might want to ignore in the gb scene.
     * for example you may not want any lights to be added as we are controlling them somewhere else
     * or you may not want to add the cameras. possible types to mask: 'bone', 'light', 'camera', 'model'
     */
    mask?: string[];
    /**
     * the materials you want to use for the scene. These materials will override any in the gb object if found.
     * you can also pass in a 'default' material to use for any unknown materials.
     */
    materials?: Record<string, Shader>;
    /**
     * the global framerate of the animation
     */
    fps?: number;
    /**
     * an array of animation mixes. you can define the duration when mixing animations. eg
     * `['run', 'walk', 3]` will mean when we transition play the walk animation whilst currently playing the run animation
     * the mix will take 3 seconds to transition fully to the walk animation
     */
    mixes?: [string, string, number][];
    /**
     * Most FBX conversions give us a single global animation rather containing all other animations.
     * Clips are where we can chop parts of the animation out. for example if we want to add a run and walk animation from the main animaton
     * we could add a clip like so:
     * ```
     * {
     *  walk:{frames:[100, 200], loop:true, speed:2},
     *  run:{frames:[10, 100], loop:true, speed:2}
     * }
     *
     * // to play the run clip:
     * scene.animationUtils.play('run');
     * ```
     */
    clips?: Record<string, {
        frames: [number, number];
        loop?: boolean;
        speed?: number;
    }>;
    /** Setting to false prevents the animation from playing on creation */
    autoPlay?: boolean;
}
export declare class SceneLibrary {
    readonly gbObject: GBObject;
    geometryHash: Record<string, Geometry3D | GeometryFragment>;
    readonly geometryBatch: Geometry3D[];
    readonly materials: Record<string, Shader>;
    readonly geometries: (Geometry3D | GeometryFragment)[][];
    constructor(gbObject: GBObject);
    /**
     * A way to pull out a geometry from the scenes cache based on the name of the geometry
     *
     * @param id - the id of the geometry that you would like returned
     * @returns the geometry instance
     */
    getGeometry(id: string): Geometry3D | GeometryFragment;
    /**
     * This will create an instance of a scene. A scene will have an animationController
     * automatically attached to it is animation is present.
     * We also attach a utils component that lets you search and find elements in the scene. (see 'SceneUtils')
     * @param data - the scene options to customize the scene as its generated
     */
    getScene(data?: SceneOptions): Entity3D;
    private _processFragPrimitive;
    private _processPrimitive;
    private _findMaterial;
}
export declare function gbToOdieParser(gbObject: GBObject): SceneLibrary;
//# sourceMappingURL=gbToOdieParser.d.ts.map