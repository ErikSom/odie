import type { ComponentInterface } from '../../core/ComponentInterface';
import { Matrix4 } from '../../math/matrix/Matrix4';
import { Frustum } from '../../math/misc/Frustum';
import { Plane } from '../../math/shapes/Plane';
import { Vector3 } from '../../math/vector/Vector3';
import { Entity3D } from '../core/Entity3D';
export declare enum PROJECTION_TYPE {
    /**
     * classic camera! This projection mode is designed to mimic the way the human eye sees. It is the most common projection mode used for rendering a 3D scene.
     */
    PERSPECTIVE = 0,
    /**
     * In this projection mode, an object's size in the rendered image stays constant regardless of its distance from the camera.
     */
    ORTHOGRAPHIC = 1,
    /**
     * In this projection mode, you have full control over the projection matrix. For example when using VR.
     */
    CUSTOM = 2
}
export interface CameraOptions {
    up?: Vector3;
    debug?: any;
    orthographicSize?: number;
    lookAtTarget?: Vector3;
    mode?: PROJECTION_TYPE;
    zoom?: number;
    fov?: number;
    near?: number;
    far?: number;
    custom?: boolean;
}
export declare class CameraComponent implements ComponentInterface<CameraOptions, Entity3D> {
    /**
     * the default name of this component
     */
    static DEFAULT_NAME: string;
    /**
     * the cached screen space width to update projection matrix with
     */
    width: number;
    /**
     * the cached screen space height to update projection matrix with
     */
    height: number;
    /**
     * Vertical field of view in radians
     */
    fov: number;
    /**
     * Near bound of the frustum
     */
    near: number;
    /**
     * Near bound of the frustum
     */
    far: number;
    /**
     * the matrix that calculates how to transform the view into 2D space
     */
    projection: Matrix4;
    /**
     * the view that we render the camera from (this is usually the inverse of the cameras world transform)
     */
    view: Matrix4;
    /**
     * a matrix combining view and projection
     */
    viewProjection: Matrix4;
    /**
     * the forward facing direction of the camera
     */
    forward: Vector3;
    /**
     * the global position of the camera
     */
    position: Vector3;
    /**
     * the camera projection mode PERSPECTIVE (0) or ORTHOGRAPHIC (1) or CUSTOM (2)
     */
    mode: PROJECTION_TYPE;
    /**
     * set to true if you want to control the matrix how you like
     */
    custom: boolean;
    /**
     * used to zoom camera in / out
     */
    zoom: number;
    /**
     * used by the orthographic camera to zoom in / out
     */
    orthographicSize: number;
    /**
     * @Internal
     * a dirty id, used to know if we should recalculate the matrix
     */
    dirty: number;
    /**
     * something for the camera to point to!
     * if this target is set, the camera will disregard its rotation properties
     * and set it automatically to point to this
     */
    lookAtTarget: Vector3;
    /**
     * clipping plane, only render things on one side of the plane
     */
    clippingPlane: Plane;
    /**
     * the amount of give you want on the clipping plane
     */
    clipBias: number;
    /**
     * a frustum for this camera, automatically calculated.
     */
    readonly frustum: Frustum;
    /**
     * the entity this component is attached to
     */
    readonly entity: Entity3D;
    constructor(entity: Entity3D, data?: CameraOptions);
    update(): void;
    /**
     * @internal
     * updates this camera and recalculates its projection matrix using the current settings
     * and the width and height passed in.
     * @param w - width of the space the camera is rendering to
     * @param h - height of the space the camera is rendering to
     */
    updateProjection(w: number, h: number): void;
    /**
     * adding a clipping plane is an optimisation that allows us to clip a scene based on the plane provided.
     * think of it like a mask! only render stuff on one side of the plane. This is a clever technique
     * that uses the cameras matrix!
     *
     * - pros - much faster as we do not need to customize shaders to discard pixels
     * - cons - can cause the depth buffer to lose accuracy. (for most use case, you won't notice!)
     *
     * @param plane - the plane that will be used for clipping
     */
    addClippingPlane(plane: Plane): void;
    /**
     * Copies a cameras information to another
     * @param cameraComponent - the camera component to copy info to
     */
    copy(cameraComponent: CameraComponent): void;
    /**
     * updates the view matrix of the camera. unless custom, this is calculated be inverting the world matrix.elements
     * it also sets the camera forward and position that we send to the gpu.
     */
    private _updateView;
}
//# sourceMappingURL=CameraComponent.d.ts.map