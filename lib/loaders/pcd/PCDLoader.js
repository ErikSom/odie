import { Geometry, LoaderResource } from 'pixi.js';
import { PCDParser } from './PCDParser';
if (!Geometry.cache) {
    Geometry.cache = {};
    // eslint-disable-next-line func-names
    Geometry.from = function (url) {
        if (Geometry.cache[url]) {
            return Geometry.cache[url];
        }
        throw (new Error(`GEOMETRY: "${url}" does not exist in the cache`));
    };
}
const ResourceX = LoaderResource;
ResourceX.setExtensionXhrType('pcd', ResourceX.XHR_RESPONSE_TYPE.BUFFER);
/**
 * A resource-loader plugin that uses the PCD Parser to load and parse PCD files
 * Point CLouds for all!
 */
export function PCDLoader(resource, next) {
    if (!resource.data || resource.extension !== 'pcd') {
        return next();
    }
    const geometry = PCDParser(resource.data);
    Geometry.cache[resource.url] = geometry;
    return next();
}
