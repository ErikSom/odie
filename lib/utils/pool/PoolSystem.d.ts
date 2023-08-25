import type { Entity, SystemInterface } from '../../core';
/**
 * manages pooling of Entity instances, will return a pooled instance of an entity type if it has one, otherwise will
 * create a new instance and return that. Entities will be initialised with the supplied data
 */
/**
 * manages pooling of Entity instances, will return a pooled instance of an entity type if it has one, otherwise will
 * create a new instance and return that. Entities will be initialised with the supplied data
 */
export declare class PoolSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    /**
     * temporary store of items to remove, cleared in postupdate
     */
    private _toRemove;
    /**
     * populates the pool with the specified number of instances
     * @param EntityClassType - Entity class type to prepopulate
     * @param total - number of instances to create
     */
    prepopulate<T extends Entity>(EntityClassType: new () => T, total: number): void;
    /**
     * return an entity of the specified class type, initialised with the supplied data object.
     * Entity will be automatically returned to the pool when it is destroyed.
     * @param EntityClassType - the class of entity required
     * @param data - data object to initialise entity from
     */
    get<U, T extends Entity<U>>(EntityClassType: new () => Entity<U>, data?: U): T;
    /**
     * the listener that will check for when an entity has been destroyed
     * Main thing it does is return the entity back to the pool
     *
     * @param entity - the entity that is going to be destroyed
     */
    onEntityDestroyed(entity: Entity): void;
    /**
     * puts an entity back into its pool. The entity will be reset and all signal listeners removed
     * @param entity - the entity to return to the pool
     */
    return(entity: Entity): void;
    /**
     * internal method called by odie
     */
    postupdate(): void;
    /**
     * internal method called by odie
     */
    reset(): void;
}
//# sourceMappingURL=PoolSystem.d.ts.map