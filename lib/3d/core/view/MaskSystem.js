import { Signal } from 'typed-signals';
import { View3DComponent } from '.';
/** A system designed to allow for the use of 3d masking using webGLs stencil buffer
 ** Masks are to be created from Entity3D objects
 ** Only layers from the LayerSystem can be masked
 */
export class MaskSystem {
    constructor() {
        this.signals = {
            /** called once the state of the masks change
             * * example - adding or removing masks */
            onMasksChange: new Signal(),
        };
        this._maskedLayers = [];
        // TODO: Make this more dynamic to allow for more depth levels
        this._renderLevels = [[], [], []];
        this.enabled = true;
    }
    /** Store access to webGL instead of doing it multiple times every render loop */
    start() {
        const view3d = this.scene.view3d;
        this._gl = view3d.renderer.gl;
        this._cachedRenderLayers = view3d.layers.renderLayers;
        // TODO maybe not the best... but override render layers for full control!
        view3d.layers.renderLayers = this._renderFunction.bind(this);
    }
    /**
     * Add mask from layer based on id
     * @param id - The id of the layer
     * @param mask - The entity that will be the mask for the given layer
     * @param options - Options to change how the mask will function
     * @returns The layer that the mask object is being set to
     */
    addMask(layer, mask, options) {
        if (!layer)
            return;
        const data = { mask, layer, depth: 0, testSelf: !!(options === null || options === void 0 ? void 0 : options.testSelf) };
        this._maskedLayers.push(data);
        const layerSystem = this.scene.view3d.layers;
        const oldLayer = layerSystem.getLayerFromEntity(mask);
        oldLayer.remove(mask);
        this.signals.onMasksChange.emit(layer, mask);
    }
    /**
     * Remove mask from layer based on id, detach signal bindings and return object to original layer
     * @param id - The id of the layer
     * @returns The layer that the mask object originally belonged to
     */
    removeLayerMask(layer) {
        if (!layer)
            return null;
        let data = null;
        for (let i = 0; i < this._maskedLayers.length; i++) {
            const element = this._maskedLayers[i];
            if (element.layer === layer) {
                data = this._maskedLayers[i];
                this._maskedLayers.splice(i, 1);
            }
        }
        const oldLayerId = data.mask.view3d.layerId;
        const layerSystem = this.scene.view3d.layers;
        const oldLayer = layerSystem.getLayer(oldLayerId) || layerSystem.getLayer('default');
        oldLayer.add(data.mask);
        this.signals.onMasksChange.emit(oldLayer, data.mask);
        return oldLayer;
    }
    /** Prepare webGL to render the mask
     * @param layer - The layer currently being rendered
     * @param renderData - The render information to allow mask system to call the renderGroup function in View3DSystem
     */
    preRender(layer, renderData) {
        const view3dSystem = this.scene.view3d;
        const layerMask = this.maskingInformation(layer);
        const gl = this._gl;
        if (!layerMask)
            return;
        let layerInfo = null;
        for (let i = 0; i < this._maskedLayers.length; i++) {
            const element = this._maskedLayers[i];
            if (element.layer === layer) {
                layerInfo = this._maskedLayers[i];
            }
        }
        if (layerInfo.testSelf) {
            layerInfo.mask.view3d.state.clockwiseFrontFace = false;
            gl.depthMask(true);
            gl.disable(gl.STENCIL_TEST);
            view3dSystem.renderGroup(layerInfo.mask, renderData);
            layerInfo.mask.view3d.state.clockwiseFrontFace = true;
            gl.enable(gl.STENCIL_TEST);
            gl.depthMask(false);
        }
        view3dSystem.renderGroup(layerInfo.mask, renderData);
    }
    /** Reset webGL to original state from before mask render
     * @param layer - The layer currently being rendered
     */
    postRender() {
        const gl = this._gl;
        gl.disable(gl.STENCIL_TEST);
    }
    /** Remove masks on all masked layers */
    removeAll() {
        for (let i = 0; i < this._maskedLayers.length; i++) {
            const element = this._maskedLayers[i];
            this.removeLayerMask(element.layer);
        }
    }
    /** Get information from a mask or layer
     * @param source - The layer or mask currently being check in use by masking system
     */
    maskingInformation(source) {
        for (let i = 0; i < this._maskedLayers.length; i++) {
            const element = this._maskedLayers[i];
            if (source === element.layer || source === element.mask)
                return element;
        }
        return null;
    }
    _renderFunction(renderData) {
        var _a;
        if (!this.enabled) {
            this._cachedRenderLayers.call(this.scene.view3d.layers, renderData);
            return;
        }
        const view3d = this.scene.view3d;
        const gl = this._gl;
        // reset that stencil buffer
        gl.clear(gl.STENCIL_BUFFER_BIT);
        const layersHash = view3d.layers.layers;
        for (let i = 0; i < this._renderLevels.length; i++) {
            this._renderLevels[i].length = 0;
        }
        for (const key in layersHash) {
            const layer = layersHash[key];
            if (layer.id !== 'default') {
                const maskInfo = this.maskingInformation(layer);
                const maskDepth = (_a = maskInfo === null || maskInfo === void 0 ? void 0 : maskInfo.depth) !== null && _a !== void 0 ? _a : 0;
                if (maskInfo) {
                    if (!this._cullMaskLayer(maskInfo, renderData.camera) && this._renderLevels[maskDepth]) {
                        this._renderLevels[maskDepth].push(layer);
                    }
                }
                else {
                    this._renderLevels[maskDepth].push(layer);
                }
            }
        }
        for (let i = 1; i < this._renderLevels.length; i++) {
            if (this._renderLevels[i].length === 0) {
                if (this._renderLevels[i + 1] && this._renderLevels[i + 1].length) {
                    this._renderLevels[i + 1].length = 0;
                }
            }
        }
        const firstLayer = this._renderLevels[0][0];
        firstLayer.onPreRender.emit(firstLayer, renderData);
        this._renderLayer(firstLayer, renderData);
        if (layersHash.default)
            this._renderLayer(layersHash.default, renderData);
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        for (let i = 1; i < this._renderLevels.length; i++) {
            const levelDepth = this._renderLevels[i];
            levelDepth.forEach((layer) => {
                gl.stencilFunc(gl.EQUAL, (i - 1), 0xff);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                this.preRender(layer, renderData);
            });
            // render scenes in level..
            levelDepth.forEach((layer) => {
                // need to apply the mask for only this world..
                // invert the scene..
                gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);
                layer.onPreRender.emit(layer, renderData);
                this.preRender(layer, renderData);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                gl.stencilFunc(gl.EQUAL, 255 - i, 0xff);
                gl.colorMask(true, true, true, true);
                gl.depthMask(true);
                gl.clear(gl.DEPTH_BUFFER_BIT);
                this._renderLayer(layer, renderData);
                // undo the mask...
                gl.colorMask(false, false, false, false);
                gl.depthMask(false);
                gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);
                this.preRender(layer, renderData);
            });
        }
        gl.disable(gl.STENCIL_TEST);
        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
    }
    _renderLayer(layer, renderData) {
        const view3d = this.scene.view3d;
        view3d.renderGroup(layer.opaqueRenderables, renderData);
        view3d.renderGroup(layer.transparentRenderables, renderData);
    }
    /**
     * Checks whether or not the layer needs to be culled based off mask intersection with camera's frustum
     * @param maskData - Contain relevant information regarding the layers and their masks,
     * as well as signals for the render loop
     * @param camera - the camera in the current renderSession and not the one attached to the View3System
     * @returns cull state of the layer
     */
    _cullMaskLayer(maskData, camera) {
        const frustum = camera.camera.frustum;
        const view3dComp = maskData.mask.getComponent(View3DComponent);
        const cull = !frustum.intersectsSphere(view3dComp.getBoundingSphere());
        return cull;
    }
}
MaskSystem.DEFAULT_NAME = 'mask';
