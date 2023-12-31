import path from 'path';
class CacheSingleton {
    constructor() {
        this._map = {};
        this.basePath = '';
    }
    get(id) {
        id = this.basePath + id;
        if (this._map[id]) {
            return this._map[id];
        }
        // sometimes the urls are not always the same
        // eg './myThing.png' !== '/myThing.png' !== 'myThing.png'
        // normalizing the url will mean they all map to the same id!
        id = path.normalize(id);
        if (this._map[id]) {
            return this._map[id];
        }
        throw new Error(`Odie : "${id}" does not exist in the cache`);
    }
    add(id, item) {
        this._map[id] = item;
    }
}
export const Cache = new CacheSingleton();
