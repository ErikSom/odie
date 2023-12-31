export class Pool {
    /**
     * a pool of reusable instances of a class
     * @param ClassType -
     */
    constructor(ClassType) {
        this._pool = [];
        this._debug = false;
        this._classType = ClassType;
        this._pool = [];
        this._debug = false;
    }
    /**
     * Get a pool of items of the specified type
     * @param ClassType -
     */
    static getPool(ClassType) {
        if (!this._poolsByClass.has(ClassType)) {
            this._poolsByClass.set(ClassType, new Pool(ClassType));
        }
        return this._poolsByClass.get(ClassType);
    }
    /**
     * Get an item of the specified type from the pool
     * @param  ClassType -
     */
    static get(ClassType) {
        return this.getPool(ClassType).get();
    }
    /**
     * Return an object to the pool
     * @param object -
     */
    static return(object) {
        this.getPool(object.constructor).return(object);
    }
    /**
     * create items to populate pool
     * @param total - the number of items to add to the pool
     */
    prepopulate(total) {
        for (let i = 0; i < total; i++) {
            this._pool.push(new this._classType());
        }
    }
    /**
     * get an item from the pool, or create a new one if the pool is empty
     */
    get() {
        let item = this._pool.pop();
        if (!item) {
            item = new this._classType();
        }
        return item;
    }
    /**
     * add an object into the pool
     * @param item - the itm to add to the pool
     */
    return(item) {
        if (this._pool.indexOf(item) !== -1) {
            if (this._debug)
                console.warn('Object alredy in POOL', item);
            return;
        }
        this._pool.push(item);
    }
    /**
     * number of items in the pool
     */
    get total() {
        return this._pool.length;
    }
}
Pool._poolsByClass = new Map();
