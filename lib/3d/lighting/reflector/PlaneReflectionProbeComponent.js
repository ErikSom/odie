import { RenderTexture, SCALE_MODES, Sprite } from 'pixi.js';
import { Signal } from 'typed-signals';
import { CLEAR_COLOR } from '../../../math/misc/ColorArray';
import { Plane } from '../../../math/shapes/Plane';
import { CameraEntity } from '../../camera/CameraEntity';
import { RenderGroupComponent } from './RenderGroupComponent';
/**
 * A reflection plane will render a reflected scene from the pov of the camera.
 * used for sexy lovely reflections. You can also render a scene for reflections
 */
export class PlaneReflectionProbeComponent {
    constructor(entity, opts = {}) {
        var _a, _b;
        /**
         * if false, nothing will be rendering is skipped. true by default
         */
        this.enabled = true;
        this.signals = {
            /**
             * dispatched before the reflection probe has rendered
             */
            onRenderBegin: new Signal(),
            /**
             * dispatched after the reflection probe has rendered
             */
            onRenderComplete: new Signal(),
        };
        this.entity = entity;
        if (opts.reflection || opts.reflection === undefined) {
            this.reflectionTexture = RenderTexture.create({ scaleMode: SCALE_MODES.LINEAR, resolution: opts.resolution });
            this.reflectionTexture.baseTexture.framebuffer.enableDepth();
        }
        if (opts.refraction) {
            this.refractionTexture = RenderTexture.create({ scaleMode: SCALE_MODES.LINEAR, resolution: opts.resolution });
            this.refractionTexture.baseTexture.framebuffer.enableDepth();
        }
        this._plane = opts.plane || new Plane();
        this._plane.normal.set(0, 1, 0);
        this._clipBias = opts.clipBias || 0;
        this.clearColor = (_a = opts.clearColor) !== null && _a !== void 0 ? _a : CLEAR_COLOR;
        this.clear = (_b = opts.clear) !== null && _b !== void 0 ? _b : true;
        this._virtualCamera = new CameraEntity({
            custom: true,
        });
        this._debug = !!opts.debug;
        if (this._debug) {
            // debug..
            this._debug = true;
            this._debugSprite = Sprite.from(this.reflectionTexture);
        }
        this._frequency = 0;
        this._refreshRate = opts.refreshRate || 1;
    }
    addedToScene(scene) {
        scene.view3d.onPreDrawScene.add(this);
        scene.onResize.add(this);
        this.resize();
    }
    removedFromScene(scene) {
        scene.view3d.onPreDrawScene.remove(this);
        scene.onResize.remove(this);
    }
    preDrawScene(view3d) {
        if (this._frequency++ % this._refreshRate || !this.enabled)
            return;
        this.signals.onRenderBegin.emit(this);
        if (this._debug) {
            view3d.stage.addChild(this._debugSprite);
            this._debugSprite.width = 500;
            this._debugSprite.scale.y = this._debugSprite.scale.x;
        }
        const renderer = view3d.renderer;
        const cameraComp = this._virtualCamera.camera;
        view3d.camera.camera['_updateView']();
        cameraComp.copy(view3d.camera.camera);
        this._plane.normal.set(0, 0, 1);
        this._plane.constant = 0;
        this._plane.applyMatrix4(this.entity.transform.worldTransform);
        cameraComp.clipBias = this._clipBias;
        if (cameraComp.forward.dot(this._plane.normal) < 0) {
            const renderGroup = this.entity.getComponent(RenderGroupComponent);
            if (this.refractionTexture) {
                cameraComp.clippingPlane = null;
                // TODO this gets called twice (here and in view3dSystem..)
                cameraComp.updateProjection(renderer.width, renderer.height);
                view3d.drawScene(this._virtualCamera, this.refractionTexture, renderGroup.toRenderList, renderGroup.toIgnoreList, this.clear, this.clearColor);
            }
            if (this.reflectionTexture) {
                cameraComp.view.reflectOnPlane(this._plane);
                cameraComp.clippingPlane = this._plane;
                // TODO this gets called twice (here and in view3dSystem..)
                cameraComp.updateProjection(renderer.width, renderer.height);
                view3d.drawScene(this._virtualCamera, this.reflectionTexture, renderGroup.toRenderList, renderGroup.toIgnoreList, this.clear, this.clearColor);
            }
        }
        this.signals.onRenderComplete.emit(this);
    }
    resize() {
        // we want to use the actual renderers width and height, as this takes into account resolution
        const renderer = this.entity.scene.view3d.renderer;
        if (this.reflectionTexture.width !== renderer.width && this.reflectionTexture.height !== renderer.height) {
            // TODO render texture on view 3d... make that better!
            this.reflectionTexture.resize(renderer.width, renderer.height);
        }
    }
}
PlaneReflectionProbeComponent.DEFAULT_NAME = 'planeReflectionProbe';
