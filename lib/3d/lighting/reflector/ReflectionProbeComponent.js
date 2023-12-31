import { RenderTexture, SCALE_MODES, Texture } from 'pixi.js';
import { Signal } from 'typed-signals';
import { Matrix4 } from '../../../math/matrix/Matrix4';
import { CLEAR_COLOR } from '../../../math/misc/ColorArray';
import { Vector3 } from '../../../math/vector/Vector3';
import { CameraEntity } from '../../camera/CameraEntity';
import { RenderGroupComponent } from './RenderGroupComponent';
const ENV_CUBE_LOOK_DIR = [
    new Vector3(1.0, 0.0, 0.0),
    new Vector3(-1.0, 0.0, 0.0),
    new Vector3(0.0, 1.0, 0.0),
    new Vector3(0.0, -1.0, 0.0),
    new Vector3(0.0, 0.0, 1.0),
    new Vector3(0.0, 0.0, -1.0),
];
const ENV_CUBE_LOOK_UP = [
    new Vector3(0.0, -1.0, 0.0),
    new Vector3(0.0, -1.0, 0.0),
    new Vector3(0.0, 0.0, 1.0),
    new Vector3(0.0, 0.0, -1.0),
    new Vector3(0.0, -1.0, 0.0),
    new Vector3(0.0, -1.0, 0.0),
];
const tempMatrix = new Matrix4();
const tempVector = new Vector3();
const tempVector2 = new Vector3();
/**
 * A reflection probe will generate a cubeTexture from capturing the scene from its point of view
 * Can be quite intensive as each update requires the scene to be rendered 6 times.length
 * But also, reflections look cool init!
 */
export class ReflectionProbeComponent {
    constructor(entity, opts = {}) {
        var _a, _b, _c, _d, _e;
        this.signals = {
            /**
             * dispatched after the reflection probe has rendered
             */
            onRenderComplete: new Signal(),
        };
        this.entity = entity;
        this.clearColor = (_a = opts.clearColor) !== null && _a !== void 0 ? _a : CLEAR_COLOR;
        this.clear = (_b = opts.clear) !== null && _b !== void 0 ? _b : true;
        this._virtualCamera = new CameraEntity({
            custom: true,
            near: (_c = opts.near) !== null && _c !== void 0 ? _c : 1,
            far: (_d = opts.far) !== null && _d !== void 0 ? _d : 800,
            fov: 90 * (Math.PI / 180),
        });
        this._mipmap = !!opts.mipmap;
        this._frequency = 0;
        this._refreshRate = (_e = opts.refreshRate) !== null && _e !== void 0 ? _e : 1;
        this._sideData = [];
        for (let i = 0; i < 6; i++) {
            const renderTexture = RenderTexture.create({
                width: opts.size || 256,
                height: opts.size || 256,
                scaleMode: SCALE_MODES.LINEAR,
                resolution: 1,
            });
            renderTexture.baseTexture.framebuffer.enableDepth();
            this._sideData.push({
                up: ENV_CUBE_LOOK_UP[i],
                direction: ENV_CUBE_LOOK_DIR[i],
                renderTexture,
            });
        }
        // @ts-ignore - PIXI Error: TextureSource in pixi needs to accept BaseTexture[]
        this.cubeTexture = Texture.from(this._sideData.map((sd) => sd.renderTexture));
        this.cubeTexture.baseTexture.mipmap = this._mipmap;
        this.enabled = true;
        entity.addChild(this._virtualCamera);
    }
    addedToScene(scene) {
        scene.view3d.onPreDrawScene.add(this);
    }
    removedFromScene(scene) {
        scene.view3d.onPreDrawScene.remove(this);
    }
    drawScene() {
        if (!this.entity.scene || !this.enabled)
            return;
        const view3d = this.entity.scene.view3d;
        if (this._refreshRate === 0 && this._frequency > 1) {
            return;
        }
        const cameraComp = this._virtualCamera.camera;
        const renderGroup = this.entity.getComponent(RenderGroupComponent);
        const cameraPosition = this.entity.transform.worldTransform.extractPosition(tempVector);
        const centerPosition = tempVector2;
        for (let i = 0; i < this._sideData.length; i++) {
            const sideData = this._sideData[i];
            const m = tempMatrix;
            centerPosition.addVectors(cameraPosition, sideData.direction);
            m.lookAtMove(cameraPosition, centerPosition, sideData.up);
            cameraComp.view = m;
            cameraComp.updateProjection(sideData.renderTexture.width, sideData.renderTexture.height);
            view3d.drawScene(this._virtualCamera, sideData.renderTexture, renderGroup.toRenderList, renderGroup.toIgnoreList, this.clear, this.clearColor);
        }
        if (this._mipmap) {
            view3d.renderer.texture.bind(this.cubeTexture);
            view3d.renderer.gl.generateMipmap(view3d.renderer.gl.TEXTURE_CUBE_MAP);
        }
        this.signals.onRenderComplete.emit(this);
    }
    preDrawScene() {
        if (this._frequency++ % this._refreshRate)
            return;
        if (this._refreshRate === 0 && this._frequency > 1) {
            return;
        }
        this.drawScene();
    }
}
ReflectionProbeComponent.DEFAULT_NAME = 'reflectionProbe';
