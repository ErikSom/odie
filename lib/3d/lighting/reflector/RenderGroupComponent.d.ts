import { Component } from '../../../core/Component';
import { Group } from '../../../core/groups/Group';
import type { Scene } from '../../../core/Scene';
import type { Entity3D } from '../../core/Entity3D';
export interface RenderGroupOptions {
    /**
     * any entities you want to ignore when rendering
     */
    ignore?: Entity3D[];
    /**
     * any entities you want to only render
     */
    render?: Entity3D[];
}
/**
 * a class makes it easy to work with lists of things you want to render in a scene!
 * it works by using both and ignore and a render list
 * the render list means only render things in this list (as long as they are in the actual main scene)
 * the ignore list means it will not render anything in this list.
 * Adding entities to this group will include all its children too
 */
export declare class RenderGroupComponent extends Component {
    static DEFAULT_NAME: string;
    /**
     * a group of elements you want to render
     */
    readonly toRender: Group<Entity3D>;
    /**
     * a group of elements you want to ignore
     */
    readonly toIgnore: Group<Entity3D>;
    private _toRenderList;
    private _toIgnoreList;
    private _renderNeedsUpdate;
    private _ignoreNeedsUpdate;
    /**
     *
     * @param entity - the entity this is attached to
     * @param options - RenderGroupOptions options
     */
    constructor(entity: Entity3D, options?: RenderGroupOptions);
    addedToScene(scene: Scene): void;
    removedFromScene(scene: Scene): void;
    entityAddedToScene(entity: Entity3D): void;
    entityRemovedFromScene(entity: Entity3D): void;
    /**
     * add an entity to the render list. all its children will also be rendered
     * @param entity - entity to add to the render list
     */
    add(entity: Entity3D): void;
    /**
     * add an entity to the ignore list. all its children will also be ignored
     * @param entity - entity to add to the render list
     */
    ignore(entity: Entity3D): void;
    private _getFlatList;
    /**
     * returns a flat list of all elements with a geometry in added to the renderList
     * this can be passed into the `drawScene` function of the `View3DSystem`
     */
    get toRenderList(): Entity3D[];
    /**
     * returns a flat list of all elements with a geometry in added to the ignoreList
     * this can be passed into the `drawScene` function of the `View3DSystem`
     */
    get toIgnoreList(): Entity3D[];
}
//# sourceMappingURL=RenderGroupComponent.d.ts.map