import { Component } from '../../../core/Component';
import { Group } from '../../../core/groups/Group';
/**
 * a class makes it easy to work with lists of things you want to render in a scene!
 * it works by using both and ignore and a render list
 * the render list means only render things in this list (as long as they are in the actual main scene)
 * the ignore list means it will not render anything in this list.
 * Adding entities to this group will include all its children too
 */
export class RenderGroupComponent extends Component {
    /**
     *
     * @param entity - the entity this is attached to
     * @param options - RenderGroupOptions options
     */
    constructor(entity, options = {}) {
        super(entity);
        this.toRender = new Group(options.render);
        this.toIgnore = new Group(options.ignore);
        this._toRenderList = [];
        this._ignoreNeedsUpdate = true;
        this._toIgnoreList = [];
        this._renderNeedsUpdate = true;
    }
    addedToScene(scene) {
        scene.onEntityAddedToScene.add(this);
        scene.onEntityRemovedFromScene.add(this);
    }
    removedFromScene(scene) {
        scene.onEntityAddedToScene.add(this);
        scene.onEntityRemovedFromScene.add(this);
    }
    entityAddedToScene(entity) {
        if (entity.view3d) {
            this._renderNeedsUpdate = true;
            this._ignoreNeedsUpdate = true;
        }
    }
    entityRemovedFromScene(entity) {
        if (entity.view3d) {
            this._renderNeedsUpdate = true;
            this._ignoreNeedsUpdate = true;
        }
    }
    /**
     * add an entity to the render list. all its children will also be rendered
     * @param entity - entity to add to the render list
     */
    add(entity) {
        this.toRender.add(entity);
        this._renderNeedsUpdate = true;
    }
    /**
     * add an entity to the ignore list. all its children will also be ignored
     * @param entity - entity to add to the render list
     */
    ignore(entity) {
        this.toIgnore.add(entity);
        this._ignoreNeedsUpdate = true;
    }
    _getFlatList(entities) {
        // map makes sure we have no duplicates..
        const map = {};
        const flatList = [];
        entities.run((entity) => {
            if (map[entity.UID])
                return;
            map[entity.UID] = entity;
            if (entity.view3d) {
                flatList.push(entity);
            }
            entity.container.traverse((child) => {
                if (map[child.UID])
                    return;
                map[child.UID] = child;
                if (child.view3d) {
                    flatList.push(child);
                }
            });
        });
        return flatList;
    }
    /**
     * returns a flat list of all elements with a geometry in added to the renderList
     * this can be passed into the `drawScene` function of the `View3DSystem`
     */
    get toRenderList() {
        if (!this.entity.scene || this._renderNeedsUpdate) {
            this._toRenderList = this._getFlatList(this.toRender);
            this._renderNeedsUpdate = false;
        }
        return this._toRenderList;
    }
    /**
     * returns a flat list of all elements with a geometry in added to the ignoreList
     * this can be passed into the `drawScene` function of the `View3DSystem`
     */
    get toIgnoreList() {
        if (!this.entity.scene || this._ignoreNeedsUpdate) {
            this._toIgnoreList = this._getFlatList(this.toIgnore);
            this._ignoreNeedsUpdate = false;
        }
        return this._toIgnoreList;
    }
}
RenderGroupComponent.DEFAULT_NAME = 'renderGroup';
