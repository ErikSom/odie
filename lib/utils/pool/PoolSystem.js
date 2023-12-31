import { Pool } from './Pool';
const signalBindingMap = new Map();
/**
 * manages pooling of Entity instances, will return a pooled instance of an entity type if it has one, otherwise will
 * create a new instance and return that. Entities will be initialised with the supplied data
 */
/**
 * manages pooling of Entity instances, will return a pooled instance of an entity type if it has one, otherwise will
 * create a new instance and return that. Entities will be initialised with the supplied data
 */
export class PoolSystem {
    constructor() {
        /**
         * temporary store of items to remove, cleared in postupdate
         */
        this._toRemove = [];
    }
    /**
     * populates the pool with the specified number of instances
     * @param EntityClassType - Entity class type to prepopulate
     * @param total - number of instances to create
     */
    prepopulate(EntityClassType, total) {
        const classPool = Pool.getPool(EntityClassType);
        classPool.prepopulate(total);
    }
    /**
     * return an entity of the specified class type, initialised with the supplied data object.
     * Entity will be automatically returned to the pool when it is destroyed.
     * @param EntityClassType - the class of entity required
     * @param data - data object to initialise entity from
     */
    get(EntityClassType, data) {
        const entity = Pool.get(EntityClassType);
        const signalBinding = entity.signals.onDestroyed.connect((entity) => this.onEntityDestroyed(entity));
        signalBindingMap.set(entity, signalBinding);
        entity.init(data);
        return entity;
    }
    /**
     * the listener that will check for when an entity has been destroyed
     * Main thing it does is return the entity back to the pool
     *
     * @param entity - the entity that is going to be destroyed
     */
    onEntityDestroyed(entity) {
        signalBindingMap.get(entity).disconnect();
        /**
         * TEMP FIX
         * this IDS getting fired around can overlap causing entities in the client to
         * not be removed.
         * basically the entity gets sent can sometimes have already been recycled causing it to have a different ID when
         * the sync system send the data.
         */
        setTimeout(() => {
            this.return(entity);
        }, 1000 / 5); // 5fps..
    }
    /**
     * puts an entity back into its pool. The entity will be reset and all signal listeners removed
     * @param entity - the entity to return to the pool
     */
    return(entity) {
        entity.reset();
        this._toRemove.push(entity);
    }
    /**
     * internal method called by odie
     */
    postupdate() {
        for (let i = 0; i < this._toRemove.length; i++) {
            const entity = this._toRemove[i];
            Pool.return(entity);
        }
        this._toRemove.length = 0;
    }
    /**
     * internal method called by odie
     */
    reset() {
        this.postupdate();
    }
}
PoolSystem.DEFAULT_NAME = 'pool';
