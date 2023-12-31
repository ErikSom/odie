import { Signal } from 'typed-signals';
import { Layer } from './Layer';
import { View3DComponent } from './View3DComponent';
/** A system to manage a single or multiple layers
 ** Layers can be added at will and there is always a layer present, named "default"
 */
export class LayerSystem {
    constructor() {
        this.signals = {
            /** a signal to be emmited at the start of every update loop */
            preRender: new Signal(),
            /** a signal to be emmited at the end of every update loop */
            postRender: new Signal(),
        };
        this.layers = {};
        this._renderList = [];
    }
    update() {
        const camera = this.scene.view3d.camera;
        if (camera) {
            for (const layer in this.layers) {
                this.layers[layer].update(camera);
            }
        }
    }
    /** @returns object containing all layers */
    getAll() {
        return this.layers;
    }
    /** @returns array containing all layers in order of renderIndex*/
    getOrderedArray() {
        return this._renderList;
    }
    /**
     * Find a layer based on the entity it contains
     * @param entity - The entity in which we check for its layer
     * @returns A layer containing the entity given
     */
    getLayerFromEntity(entity) {
        const view3d = entity.getComponent(View3DComponent);
        return (view3d === null || view3d === void 0 ? void 0 : view3d.layer) || this.layers[view3d === null || view3d === void 0 ? void 0 : view3d.layerId];
    }
    /**
     * Add layer to list of available layers
     * @param id - The id of the layer
     * @returns The instance of the new layer
     */
    addLayer(id) {
        if (this.getLayer(id)) {
            console.error(`A layer already exists with that name - ${id}`);
            return null;
        }
        const allowInstancing = this.scene.view3d.allowInstancing;
        const length = Object.keys(this.layers).length;
        this.layers[id] = this.layers[id] || new Layer(id, length, allowInstancing);
        this.orderLayers(this.getAll());
        return this.layers[id];
    }
    /**
     * Remove layer from list of available layers
     ** This should be avoided unless absolutely necessary
     * @param id - The id of the layer
     * @param clear - Used to prevent moving to new layer
     * @param newLayer - Set a new destination for the objects using an existing layer
     * @returns The layer that the objects are being set to
     */
    removeLayer(id, clear, newLayer) {
        const layer = this.layers[id];
        if (!layer || id === 'default')
            return null;
        const replacementLayer = newLayer || 'default';
        this.entitiesToLayer(layer.opaqueRenderables, replacementLayer, clear);
        this.entitiesToLayer(layer.transparentRenderables, replacementLayer, clear);
        for (let i = 0; i < this._renderList.length; i++) {
            const element = this._renderList[i];
            if (element.renderIndex > layer.renderIndex) {
                element.renderIndex--;
            }
        }
        this.orderLayers(this.getAll());
        layer.empty();
        delete this.layers[id];
        return this.layers[replacementLayer];
    }
    /**
     * Remove mask from layer based on id
     * @param id - The Id of the layer being requested
     * @returns The layer requested as long as it exists
     */
    getLayer(id) {
        return this.layers[id];
    }
    /**
     * Move a list of entities or a single entity to another layer
     * @param entities - List of entities or single entity that are to be moved
     * @param id - The id of the new layer
     * @param clear - (Used primarily by removeLayer function), used to prevent moving to new layer
     */
    entitiesToLayer(entities, id, clear) {
        const layer = this.layers[id];
        const moveEntity = (entity) => {
            const view3d = entity.view3d;
            if (!view3d)
                return;
            view3d.layer.remove(entity);
            if (!clear) {
                view3d.layerId = id;
                layer.add(entity);
            }
        };
        if (Array.isArray(entities)) {
            for (let i = 0; i < entities.length; i++) {
                const element = entities[i];
                moveEntity(element);
            }
        }
        else {
            moveEntity(entities);
        }
    }
    /**
     * Renders all available layers
     * @param renderData - Holds all the information needed to call renderGroup in View3DSystem
     */
    renderLayers(renderData) {
        const layers = this._renderList;
        this.signals.preRender.emit(this._renderList, renderData);
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            layer.onPreRender.emit(layer, renderData);
            const view3dSystem = this.scene.view3d;
            if (layer.visible) {
                view3dSystem.renderGroup(layer.opaqueRenderables, renderData);
                view3dSystem.renderGroup(layer.transparentRenderables, renderData);
            }
            layer.onPostRender.emit(layer, renderData);
        }
        this.signals.postRender.emit(this._renderList, renderData);
    }
    /**
     * Set the render index of the layer
     * @param layer - the layer that the index is being changed for
     * @param index - the index of which to set onto the layer, cannot set index to 0, cannot go out of layer list size
     */
    setLayerIndex(layer, index) {
        const size = Object.keys(this.layers).length;
        if (index <= 0 || index >= size) {
            throw new Error(`The index ${index} supplied is out of bounds ${size}`);
        }
        this._renderList.splice(this._renderList.indexOf(layer), 1);
        this._renderList.splice(index, 0, layer);
        for (let i = 0; i < this._renderList.length; i++) {
            this._renderList[i].renderIndex = i;
        }
    }
    /**
     * Sort a hash of layers for setting rendering order
     * @param layers - a hash containing layers to be sorted
     * @returns an ordered array of layers based on the layer's renderIndex
     */
    orderLayers(layers) {
        this._renderList = Object.values(layers);
        this._renderList.sort((a, b) => a.renderIndex - b.renderIndex);
        return this._renderList;
    }
}
LayerSystem.DEFAULT_NAME = 'layer';
