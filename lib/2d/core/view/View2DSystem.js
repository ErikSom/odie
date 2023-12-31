import { Container } from 'pixi.js';
import { View2DComponent } from './View2DComponent';
export class View2DSystem {
    constructor(_entity, opts = {}) {
        this.w = -1;
        this.h = -1;
        this.stage = opts.stage || new Container();
        this._innerContainer = new Container();
        this._activeItemsContainer = new Container();
        this.stage.addChild(this._innerContainer);
        this._innerContainer.addChild(this._activeItemsContainer);
        this._layers = {};
        this.camera = { x: 0, y: 0, zoom: 1, offset: { x: 0, y: 0 } };
        this.addLayer('back');
        this.addLayer('default');
        this.addLayer('front');
        this.resize(1, 1);
        // override the render function...
        const render = this.stage.render.bind(this.stage);
        this.stage.render = (renderer) => {
            this.scene.renderStart();
            render(renderer);
            this.scene.renderFinish();
        };
    }
    setCamera(camera) {
        this.camera = camera;
        this.resize(this.w, this.h);
    }
    render() {
        const zoom = this.camera.zoom;
        const stage = this.stage;
        stage.scale.set(zoom);
        stage.position.x = (this.w / 2) - ((this.w / 2) * zoom) + (this.camera.offset.x * 2);
        stage.position.y = (this.h / 2) - ((this.h / 2) * zoom) + this.camera.offset.y;
        const sx = this._innerContainer.scale.x;
        const sy = this._innerContainer.scale.y;
        this._innerContainer.x = (-this.camera.x * sx) + ((this.w) / 2);
        this._innerContainer.y = (-this.camera.y * sy) + ((this.h) / 2);
    }
    entityAddedToScene(ent) {
        const entity = ent;
        if (entity.view2d) {
            const view = entity.view2d.view;
            const layer = this._layers[entity.view2d.layer];
            view.parent = layer;
            layer.children.push(view);
        }
    }
    entityRemovedFromScene(ent) {
        const entity = ent;
        if (entity.view2d) {
            const view = entity.view2d.view;
            const layer = this._layers[entity.view2d.layer];
            const index = layer.children.indexOf(view);
            if (index !== -1) {
                view.parent = null;
                layer.children.splice(index, 1);
            }
        }
    }
    empty() {
        for (const i in this._layers) {
            this._layers[i].removeChildren();
        }
    }
    addLayer(id, index = -1) {
        this._layers[id] = new Container();
        if (index === -1) {
            index = this._activeItemsContainer.children.length;
        }
        this._activeItemsContainer.addChildAt(this._layers[id], index);
    }
    /**
     * Changes an entities layer
     * @param entity - entity to swap layer
     * @param newLayer - id of layer to swap too
     * @param depth - depth to add the entity at
     */
    setEntityLayer(entity, newLayer, depth = -1) {
        if (!this._layers[newLayer]) {
            throw new Error(`Layer doesn't exist: ${newLayer}`);
        }
        const view2d = entity.getComponent(View2DComponent);
        if (view2d) {
            const view = view2d.view;
            const layer = this._layers[view2d.layer];
            const index = layer.children.indexOf(view);
            if (index !== -1) {
                layer.removeChild(view);
            }
            if (depth === -1) {
                depth = this._layers[newLayer].children.length;
            }
            this._layers[newLayer].addChildAt(view, depth);
            view2d.layer = newLayer;
        }
    }
    /**
     * Sets a layer to a specific index
     * @param layerName - name of the layer
     * @param index - index to add the layer at
     */
    setLayerAt(layerName, index) {
        const layer = this.layers[layerName];
        if (!layer)
            return;
        this.activeItemsContainer.addChildAt(layer, index);
    }
    resize(w, h) {
        if (this.w === w && this.h === h)
            return;
        this.w = w;
        this.h = h;
    }
    get layers() {
        return this._layers;
    }
    get activeItemsContainer() {
        return this._activeItemsContainer;
    }
    get innerContainer() {
        return this.innerContainer;
    }
}
View2DSystem.DEFAULT_NAME = 'view2d';
