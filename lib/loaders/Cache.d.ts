declare class CacheSingleton {
    basePath: string;
    private _map;
    constructor();
    get<T>(id: string): T;
    add<T>(id: string, item: T): void;
}
export declare const Cache: CacheSingleton;
export {};
//# sourceMappingURL=Cache.d.ts.map