import { Matrix4 } from '../../math/matrix/Matrix4';
import { Frustum } from '../../math/misc/Frustum';
import { Plane } from '../../math/shapes/Plane';
import { Vector3 } from '../../math/vector/Vector3';
import { Vector4 } from '../../math/vector/Vector4';
import { Entity3D } from '../core/Entity3D';
import { SphereGeometry } from '../geometry/SphereGeometry';
import { ColorMaterial } from '../materials';
const inverted = new Matrix4();
const tempPlane = new Plane();
export var PROJECTION_TYPE;
(function (PROJECTION_TYPE) {
    /**
     * classic camera! This projection mode is designed to mimic the way the human eye sees. It is the most common projection mode used for rendering a 3D scene.
     */
    PROJECTION_TYPE[PROJECTION_TYPE["PERSPECTIVE"] = 0] = "PERSPECTIVE";
    /**
     * In this projection mode, an object's size in the rendered image stays constant regardless of its distance from the camera.
     */
    PROJECTION_TYPE[PROJECTION_TYPE["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
    /**
     * In this projection mode, you have full control over the projection matrix. For example when using VR.
     */
    PROJECTION_TYPE[PROJECTION_TYPE["CUSTOM"] = 2] = "CUSTOM";
})(PROJECTION_TYPE || (PROJECTION_TYPE = {}));
export class CameraComponent {
    constructor(entity, data = {}) {
        var _a;
        /**
         * used to zoom camera in / out
         */
        this.zoom = 1;
        this.entity = entity;
        this.width = 0;
        this.height = 0;
        this.fov = data.fov || 60 * (Math.PI / 180);
        this.near = data.near || 0.1;
        this.far = data.far || 1000;
        this.zoom = (_a = data.zoom) !== null && _a !== void 0 ? _a : 1;
        this.projection = new Matrix4();
        this.view = new Matrix4();
        this.viewProjection = new Matrix4();
        this.forward = new Vector3();
        this.position = new Vector3();
        this.mode = data.mode || 0;
        this.lookAtTarget = data.lookAtTarget;
        this.custom = data.custom || false;
        this.orthographicSize = data.orthographicSize || 170;
        this.dirty = 0;
        if (data.debug) {
            data.debug = new Entity3D({
                geometry: new SphereGeometry(2),
                material: new ColorMaterial(0xFF0000),
            });
            entity.addChild(data.debug);
        }
        this.clippingPlane = null;
        this.clipBias = 0;
        this.frustum = new Frustum();
    }
    update() {
        // TODO I think we could move this to a component...
        // just use the new look at function. But keeping for now as it might break a few projects
        if (this.lookAtTarget) {
            this.entity.transform.lookAt(this.lookAtTarget);
        }
    }
    /**
     * @internal
     * updates this camera and recalculates its projection matrix using the current settings
     * and the width and height passed in.
     * @param w - width of the space the camera is rendering to
     * @param h - height of the space the camera is rendering to
     */
    updateProjection(w, h) {
        this.width = w;
        this.height = h;
        this._updateView();
        if (this.mode === PROJECTION_TYPE.PERSPECTIVE) {
            this.projection.makePerspective(this.fov / this.zoom, w / h, this.near, this.far);
        }
        else if (this.mode === PROJECTION_TYPE.ORTHOGRAPHIC) {
            const aspectRatio = h / w;
            const size = this.zoom * this.orthographicSize;
            this.projection.makeOrthographic(-size, size, -size * aspectRatio, size * aspectRatio, this.near, this.far);
        }
        if (this.clippingPlane) {
            this.addClippingPlane(this.clippingPlane);
        }
        this.viewProjection.multiplyMatrices(this.projection, this.view);
        this.frustum.setFromMatrix(this.viewProjection);
        this.dirty++;
    }
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
    addClippingPlane(plane) {
        const clippingPlane = tempPlane.copy(plane);
        const projection = this.projection;
        clippingPlane.applyMatrix4(this.view);
        const clipPlane = new Vector4();
        const q = new Vector4();
        clipPlane.set(clippingPlane.normal.x, clippingPlane.normal.y, clippingPlane.normal.z, clippingPlane.constant);
        const elements = projection.elements;
        q.x = (Math.sign(clipPlane.x) + elements[8]) / elements[0];
        q.y = (Math.sign(clipPlane.y) + elements[9]) / elements[5];
        q.z = -1.0;
        q.w = (1.0 + elements[10]) / elements[14];
        // Calculate the scaled plane vector
        clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
        // Replacing the third row of the projection matrix
        elements[2] = clipPlane.x;
        elements[6] = clipPlane.y;
        elements[10] = clipPlane.z + 1.0 - this.clipBias;
        elements[14] = clipPlane.w;
    }
    /**
     * Copies a cameras information to another
     * @param cameraComponent - the camera component to copy info to
     */
    copy(cameraComponent) {
        this.width = cameraComponent.width;
        this.height = cameraComponent.height;
        this.fov = cameraComponent.fov;
        this.near = cameraComponent.near;
        this.far = cameraComponent.far;
        this.mode = cameraComponent.mode;
        this.orthographicSize = cameraComponent.orthographicSize;
        this.projection.copy(cameraComponent.projection);
        this.view.copy(cameraComponent.view);
        this.forward.copy(cameraComponent.forward);
        this.position.copy(cameraComponent.position);
    }
    /**
     * updates the view matrix of the camera. unless custom, this is calculated be inverting the world matrix.elements
     * it also sets the camera forward and position that we send to the gpu.
     */
    _updateView() {
        const forward = this.forward;
        if (!this.custom) {
            const wt = this.entity.transform.worldTransform;
            const te = wt.elements;
            forward.x = te[8];
            forward.y = te[9];
            forward.z = te[10];
            forward.setLength(-1);
            this.view.getInverse(wt);
            this.position.x = te[12];
            this.position.y = te[13];
            this.position.z = te[14];
        }
        else {
            inverted.getInverse(this.view);
            const te = inverted.elements;
            forward.x = te[8];
            forward.y = te[9];
            forward.z = te[10];
            forward.setLength(-1);
            this.position.x = te[12];
            this.position.y = te[13];
            this.position.z = te[14];
        }
    }
}
/**
 * the default name of this component
 */
CameraComponent.DEFAULT_NAME = 'camera';
