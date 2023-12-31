import { UniformGroup } from 'pixi.js';
import { Matrix4, Vector3 } from '../../../math';
import { CameraEntity } from '../../camera';
import { applyContainerMatrix } from './utils';
const screenPos = new Vector3();
const temp = new Vector3();
/**
 * manages the camera uniforms and the current active camera.
 */
export class CameraSystem {
    constructor(_entity, opts) {
        var _a, _b, _c, _d;
        this._view3dSystem = opts.view3d;
        const renderer = opts.view3d.renderer;
        this.fullscreen = (_a = opts.fullscreen) !== null && _a !== void 0 ? _a : true;
        this.width = (_b = opts.width) !== null && _b !== void 0 ? _b : (this.fullscreen ? renderer.width : 100);
        this.height = (_c = opts.height) !== null && _c !== void 0 ? _c : (this.fullscreen ? renderer.height : 100);
        this.cameraUniforms = new UniformGroup({
            // camera
            uProjectionMatrix: new Matrix4(),
            uViewMatrix: new Matrix4(),
            uEyePosition: new Vector3(0, 1, 0),
            uResolution: [1, 1],
            uProjectionViewMatrix: new Matrix4(),
        }, true);
        this._view3dSystem.globalUniforms.uniforms.camera = this.cameraUniforms;
        this.camera = (_d = opts.camera) !== null && _d !== void 0 ? _d : new CameraEntity();
    }
    updateCamera(camera) {
        const cameraComp = camera.camera;
        const renderer = this._view3dSystem.renderer;
        const uniforms = this.cameraUniforms.uniforms;
        const uResolution = uniforms.uResolution;
        const currentRenderTexture = renderer.renderTexture.current;
        if (!currentRenderTexture) {
            cameraComp.updateProjection(renderer.width, renderer.height);
            uResolution[0] = renderer.width * renderer.resolution;
            uResolution[1] = renderer.height * renderer.resolution;
        }
        else {
            cameraComp.updateProjection(currentRenderTexture.width, currentRenderTexture.height);
            uResolution[0] = currentRenderTexture.width * currentRenderTexture.resolution;
            uResolution[1] = currentRenderTexture.height * currentRenderTexture.resolution;
        }
        uniforms.uProjectionMatrix.copy(cameraComp.projection);
        if (!this.fullscreen) {
            applyContainerMatrix(this.width, this.height, uniforms.uProjectionMatrix, this._view3dSystem.container.worldTransform, renderer);
        }
        uniforms.uEyePosition.copy(cameraComp.position);
        uniforms.uViewMatrix.copy(cameraComp.view);
        uniforms.uProjectionViewMatrix.copy(cameraComp.viewProjection);
        this.cameraUniforms.update();
    }
    setCamera(camera) {
        this.camera = camera;
        if (!camera.scene) {
            this.scene.addChild(camera);
        }
    }
    map2dFrom3d(output, input) {
        temp.x = input.x;
        temp.y = input.y;
        temp.z = input.z;
        screenPos.project(temp, this.camera.camera.view);
        screenPos.project(screenPos, this.camera.camera.projection);
        const currentRenderTexture = this._view3dSystem.renderer.renderTexture.current;
        let width = this.width;
        let height = this.height;
        if (currentRenderTexture) {
            width = currentRenderTexture.width;
            height = currentRenderTexture.height;
        }
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        output.x = (screenPos.x * halfWidth) + halfWidth;
        output.y = (-screenPos.y * halfHeight) + halfHeight;
        return output;
    }
    resize(width, height) {
        if (this.fullscreen) {
            if (this.width === width && this.height === height)
                return;
            this.width = width;
            this.height = height;
        }
    }
}
CameraSystem.DEFAULT_NAME = 'camera';
