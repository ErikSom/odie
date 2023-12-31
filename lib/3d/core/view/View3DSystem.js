import { Container, Rectangle, Runner, UniformGroup } from 'pixi.js';
import { CLEAR_COLOR } from '../../../math/misc/ColorArray';
import { CameraSystem } from './CameraSystem';
import { CullingSystem } from './CullingSystem';
import { EntityRendererSystem } from './EntityRendererSystem';
import { FogSystem } from './FogSystem';
import { LayerSystem } from './LayerSystem';
import { LightSystem } from './LightSystem';
import { addUniformParsers } from './utils/addUniformParsers';
import { WindingSystem } from './WindingSystem';
addUniformParsers();
const defaultView3DSystemOptions = {
    culling: false,
};
/** Store single entity if only one entity is being rendered*/
const tempSingleArray = [null];
export class View3DSystem {
    constructor(entity, opts) {
        var _a, _b, _c;
        /**
         * if true will render the scene
         */
        this.visible = true;
        addUniformParsers();
        // Opts should be always present because of renderer
        opts = Object.assign(Object.assign({}, defaultView3DSystemOptions), opts);
        this.entity = entity;
        this._clearColor = (_a = opts.clearColor) !== null && _a !== void 0 ? _a : CLEAR_COLOR;
        this._clear = (_b = opts.clear) !== null && _b !== void 0 ? _b : false;
        /**
         * global uniforms
         * red by all materials..
         */
        this.globalUniforms = new UniformGroup({}, false);
        this.onRenderBegin = new Runner('renderBegin');
        this.onPreDrawScene = new Runner('preDrawScene');
        this.onRenderFinish = new Runner('renderFinish');
        this.stage = (_c = opts.stage) !== null && _c !== void 0 ? _c : new Container();
        // instancing props..
        this.container = new Container();
        this.stage.addChild(this.container);
        this.container['_render'] = this._renderChildren.bind(this);
        this.container.filterArea = new Rectangle(0, 0, 100000, 100000);
        this.renderer = opts.renderer;
        // iOS seems to be really slow with instancing, most cases its better to not acrtually use!
        // set to true if you are instancing a LOT (eg 1000+ at least)
        if (opts.instancing === undefined) {
            const iOS = !!navigator.platform && (/iPad|iPhone|iPod/).test(navigator.platform);
            opts.instancing = !iOS;
        }
        this.allowInstancing = this.renderer.geometry.hasInstance && opts.instancing;
        this.winding = this.addSubSystem(WindingSystem);
        this.layers = this.addSubSystem(LayerSystem);
        this.cameraSystem = this.addSubSystem(CameraSystem, opts);
        this.lights = this.addSubSystem(LightSystem);
        this.entityRenderer = this.addSubSystem(EntityRendererSystem);
        this.culling = opts.culling ? this.addSubSystem(CullingSystem) : null;
        this.fog = opts.fogOptions ? this.addSubSystem(FogSystem, { fog: opts.fogOptions }) : null;
    }
    addSubSystem(systemClass, options = {}) {
        const system = this.entity.scene.addSystem(systemClass, Object.assign(Object.assign({}, options), { view3d: this }));
        this.onRenderBegin.add(system);
        this.onPreDrawScene.add(system);
        this.onRenderFinish.add(system);
        return system;
    }
    setCamera(camera) {
        this.cameraSystem.setCamera(camera);
    }
    get camera() {
        return this.cameraSystem.camera;
    }
    drawScene(camera, renderTarget, renderList, ignoreList, clear, clearColor) {
        const cameraComp = camera.camera;
        const renderer = this.renderer;
        const current = renderer.renderTexture.current;
        if (renderTarget) {
            renderer.renderTexture.bind(renderTarget);
        }
        if (clear !== null && clear !== void 0 ? clear : this._clear) {
            renderer.renderTexture.clear(clearColor !== null && clearColor !== void 0 ? clearColor : this._clearColor);
        }
        this.winding.flip = cameraComp.view.determinant() < 0;
        this.entityRenderer.flush();
        this.cameraSystem.updateCamera(camera);
        this._currentRenderSession = { renderer, lights: this.lights.lightEntities, camera, ignoreList, renderList };
        this.layers.renderLayers(this._currentRenderSession);
        renderer.renderTexture.bind(current);
        this.winding.flip = false;
    }
    /**
     * Render and cull a group of entities or a single entity
     * @param renderables - A list of entities or a single entity to render
     * @param renderData - Used to hold multiple bits of information to render objects and effects (i.e. lights)
     */
    renderGroup(renderables, renderData) {
        var _a, _b;
        if (!Array.isArray(renderables)) {
            tempSingleArray[0] = renderables;
            renderables = tempSingleArray;
        }
        if (((_a = renderData.renderList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            renderables = renderables.filter((renderable) => (renderData.renderList.indexOf(renderable) !== -1));
        }
        if (((_b = renderData.ignoreList) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            renderables = renderables.filter((renderable) => (renderData.ignoreList.indexOf(renderable) === -1));
        }
        if (this.culling) {
            renderables = this.culling.cull(renderables, renderData.camera);
        }
        const entityRenderer = this.entityRenderer;
        for (let i = 0; i < renderables.length; i++) {
            const entity = renderables[i];
            const view3d = entity.view3d;
            if (!entity._worldActive || !view3d.renderable)
                continue;
            if (view3d.renderCustom) {
                view3d.renderCustom(renderData);
            }
            else {
                entityRenderer.renderEntity(entity, renderData);
            }
        }
    }
    addedToScene(scene) {
        if (!this.camera.scene) {
            scene.addChild(this.camera);
        }
    }
    entityAddedToScene(ent) {
        const entity = ent;
        if (entity.view3d) {
            const layerId = entity.view3d.layerId;
            const layer = this.layers.getLayer(layerId) || this.layers.addLayer(layerId);
            layer.add(entity);
        }
    }
    entityRemovedFromScene(ent) {
        const entity = ent;
        if (entity.view3d) {
            const layerId = entity.view3d.layerId;
            const layer = this.layers.getLayer(layerId);
            layer.remove(entity);
        }
    }
    empty() {
        const layers = this.layers.getAll();
        for (const layer in layers) {
            layers[layer].empty();
        }
    }
    _renderChildren(renderer) {
        if (!this.visible)
            return;
        this.scene.renderStart();
        // clean pixi...
        renderer.batch.flush();
        this.onRenderBegin.emit(this);
        this.layers.update();
        this.onPreDrawScene.emit(this);
        this.drawScene(this.camera, this.renderTexture, null, null, this._clear, this._clearColor);
        // no clearing makes very strange things happen!
        renderer.gl.clear(renderer.gl.DEPTH_BUFFER_BIT);
        this.onRenderFinish.emit(this);
        this.scene.renderFinish();
    }
}
View3DSystem.DEFAULT_NAME = 'view3d';
