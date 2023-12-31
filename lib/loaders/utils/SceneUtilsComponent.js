import { Component } from '../../core/Component';
export class SceneUtilsComponent extends Component {
    constructor(entity, data) {
        super(entity);
        this.map = data.map;
    }
    find(name) {
        let target = null;
        this.entity.container.traverse((e) => {
            if (e.name === name) {
                target = e;
            }
        });
        return target;
    }
    logNames(modelsOnly) {
        // eslint-disable-next-line no-console
        console.log('names:');
        this.entity.container.traverse((e) => {
            const hasModel = !!e.view3d;
            if (!modelsOnly || hasModel) {
                // eslint-disable-next-line no-console
                console.log(`   ${e.name}, model:${hasModel}`);
            }
        });
    }
    attachTo(name, entity) {
        const targetEntity = this.find(name);
        if (targetEntity) {
            targetEntity.addChild(entity);
        }
        else {
            console.warn(`entity '${name}' not found in scene`);
        }
    }
    hide(name) {
        const targetEntity = this.find(name);
        if (targetEntity) {
            targetEntity.view3d.renderable = false;
        }
    }
    show(name) {
        const targetEntity = this.find(name);
        if (targetEntity) {
            targetEntity.view3d.renderable = true;
        }
    }
    /**
     *
     * @param searchFunction - a search function performed on every entity in the scene
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     */
    search(searchFunction, asHash) {
        const entities = asHash ? {} : [];
        this.entity.container.traverse((e) => {
            if (searchFunction(e)) {
                if (entities instanceof Array) {
                    entities.push(e);
                }
                else {
                    entities[e.name] = e;
                }
            }
        });
        return entities;
    }
    /**
     * A lot like Array.first but for all entities in the scene.
     *
     * @param searchFunction - a search function performed on every entity in the scene
     */
    first(searchFunction) {
        return this.search(searchFunction)[0];
    }
    /**
     * returns either a hash or array of all entities that have the specified component name in the scene or
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     * @returns either a hash or array of all entities in the scene
     */
    getAllEntities(asHash) {
        if (!asHash)
            return this.map;
        const entities = {};
        this.entity.container.traverse((e) => {
            entities[e.name] = e;
        });
        return entities;
    }
    /**
     * @param name - the name of the component to match forward
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     * @returns either a hash or array of all entities that have the specified component name in the scene
     */
    findWithComponents(name, asHash) {
        const entities = asHash ? {} : [];
        this.entity.container.traverse((e) => {
            if (e[name]) {
                if (entities instanceof Array) {
                    entities.push(e);
                }
                else {
                    entities[e.name] = e;
                }
            }
        });
        return entities;
    }
    /**
     * returns either a hash of all lights by name in the scene or
     * an array of all lights in the scene
     * @param asHash - determines if the returned group of entities is a hash, defaults to an array
     */
    findLights(asHash) {
        return this.findWithComponents('light', asHash);
    }
}
