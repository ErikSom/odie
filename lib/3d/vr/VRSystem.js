var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CameraEntity, PROJECTION_TYPE } from '../camera';
import { View3DSystem } from '../core';
/**
 * this system will allow us to render our scenes in VR!
 * the `activate` function must be called on a user interaction event like a mouse click
 * or it will fail
 *
 * Gotcha:
 * YOU MUST RUN THIS ON HTTPS. WebXR Api does not work on http, the xr session will fail.
 * Using fido build, set the server config `https` property to true and you can dev away!
 *
 * Also this is still a little experimental, but works like a boss on the oculus quest
 *
 * @example
 * ```
 *
 * const scene = new Scene3D(...);
 *
 * const vr = scene.addSystem(VRSystem);
 *
 * button.pointertap = () => {
 *  vr.activate();
 * }
 *
 * ```
 */
export class VRSystem {
    constructor(entity) {
        /**
         * true if VR session is running
        */
        this._active = false;
        this._view3d = entity.getComponent(View3DSystem);
        this._renderVR = this._renderVR.bind(this);
    }
    /**
     * resolve true if VR is available to the user
     * false, if no VR is available
     */
    isSupported() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!navigator.xr) {
                const WebXRPolyfill = (yield import(/* webpackChunkName: "webxr-polyfill" */ 'webxr-polyfill')).default;
                navigator.xr = new WebXRPolyfill();
            }
            const immersiveOK = yield navigator.xr.isSessionSupported('immersive-vr');
            return immersiveOK;
        });
    }
    /**
     * attempts to activate the VR mode.
     * resolves true if successful
     */
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            const view3d = this._view3d;
            const gl = view3d.renderer.gl;
            const immersiveOK = yield this.isSupported();
            if (immersiveOK) {
                this._active = true;
                view3d.visible = false;
                yield (gl === null || gl === void 0 ? void 0 : gl.makeXRCompatible());
                this._session = yield (navigator === null || navigator === void 0 ? void 0 : navigator.xr.requestSession('immersive-vr'));
                this._session.addEventListener('end', () => {
                    // VR presentation has ended. Do any necessary cleanup.
                    this._cleanup();
                });
                const xrLayer = new XRWebGLLayer(this._session, gl, { stencil: true });
                this._session.updateRenderState({ baseLayer: xrLayer });
                this._referenceSpace = yield this._session.requestReferenceSpace('local');
                this._vrCamera = new CameraEntity({
                    mode: PROJECTION_TYPE.CUSTOM,
                    custom: true,
                });
                this._session.requestAnimationFrame(this._renderVR);
                return true;
            }
            return false;
        });
    }
    /**
     * turn f VR and return to regular muggle mode
     */
    deactivate() {
        if (this._session) {
            this._session.end();
        }
    }
    /**
     * called by the XR session when a frame is ready to render our scene
     *
     * @param _t - time
     * @param frame - the frame information for the VR render
     */
    _renderVR(_t, frame) {
        const { _view3d: view3d, _vrCamera: vrCamera, _session: session } = this;
        this.scene.renderStart();
        const gl = view3d.renderer.gl;
        if (this._active) {
            session.requestAnimationFrame(this._renderVR);
        }
        const pose = frame.getViewerPose(this._referenceSpace);
        if (!pose) {
            return;
        }
        // Ensure we're rendering to the layer's backbuffer.
        const layer = session.renderState.baseLayer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
        const { renderer } = view3d;
        const cameraComp = vrCamera.camera;
        // Loop through each of the views reported by the viewer pose.
        // clean pixi...
        renderer.batch.flush();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (const view of pose.views) {
            // Set the viewport required by this view.
            const viewport = layer.getViewport(view);
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
            view3d.onRenderBegin.emit(view3d);
            // update the view as we are going to copy his cameras view..
            view3d.camera.camera['_updateView']();
            cameraComp.projection.fromArray(view.projectionMatrix);
            cameraComp.view.fromArray(view.transform.inverse.matrix);
            cameraComp.view.multiply(view3d.camera.camera.view);
            view3d.layers.update();
            view3d.onPreDrawScene.emit(view3d);
            view3d.drawScene(vrCamera, null, null, null, false);
            // no clearing makes very strange things happen!
            gl.clear(renderer.gl.DEPTH_BUFFER_BIT);
            view3d.onRenderFinish.emit(view3d);
        }
        this.scene.renderFinish();
    }
    /**
     * used internally to clean up the VR stuff
     */
    _cleanup() {
        this._active = false;
        this._session = null;
        // put back the old render way....
        this._view3d.visible = true;
    }
}
VRSystem.DEFAULT_NAME = 'vr';
