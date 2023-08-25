export declare class Pool<T> {
    private static readonly _poolsByClass;
    private readonly _classType;
    private readonly _pool;
    private readonly _debug;
    /**
     * a pool of reusable instances of a class
     * @param ClassType -
     */
    constructor(ClassType: new () => T);
    /**
     * Get a pool of items of the specified type
     * @param ClassType -
     */
    static getPool<T>(ClassType: new () => T): Pool<T>;
    /**
     * Get an item of the specified type from the pool
     * @param  ClassType -
     */
    static get<T>(ClassType: new () => T): T;
    /**
     * Return an object to the pool
     * @param object -
     */
    static return<T>(object: T): void;
    /**
     * create items to populate pool
     * @param total - the number of items to add to the pool
     */
    prepopulate(total: number): void;
    /**
     * get an item from the pool, or create a new one if the pool is empty
     */
    get(): T;
    /**
     * add an object into the pool
     * @param item - the itm to add to the pool
     */
    return(item: T): void;
    /**
     * number of items in the pool
     */
    get total(): number;
}
//# sourceMappingURL=Pool.d.ts.map