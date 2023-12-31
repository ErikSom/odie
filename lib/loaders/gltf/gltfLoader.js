import { gltfToGbParser } from '@goodboydigital/gb-model-tools';
import { Geometry, LoaderResource } from 'pixi.js';
import { gbToOdieParser } from '../gb/gbToOdieParser';
const ResourceX = LoaderResource;
ResourceX.setExtensionXhrType('bin', ResourceX.XHR_RESPONSE_TYPE.BUFFER);
Geometry.sceneCache = Geometry.sceneCache || {};
// eslint-disable-next-line consistent-return
export function gltfLoader(resource, next) {
    if (!resource.data || resource.extension !== 'gltf') {
        return next();
    }
    const json = JSON.parse(resource.data);
    const loadOptions = {
        crossOrigin: resource.crossOrigin,
        parentResource: resource,
    };
    const basePath = _getBaseUri(resource.url);
    resource.name.split('.').pop();
    let count = 0;
    const buffers = [];
    const onBufferLoaded = (res) => {
        buffers.push(res.data);
        count++;
        if (count === json.buffers.length) {
            gltfToGbParser(json, buffers, (gbObject) => {
                const scene = gbToOdieParser(gbObject);
                Geometry.sceneCache[resource.url] = scene;
                next();
            });
        }
    };
    if (json.buffers) {
        for (const bid in json.buffers) {
            const bufferPath = basePath + json.buffers[bid].uri;
            this.add(json.buffers[bid].uri, bufferPath, loadOptions, onBufferLoaded);
        }
    }
}
function _getBaseUri(uri) {
    // https://github.com/AnalyticalGraphicsInc/cesium/blob/master/Source/Core/getBaseUri.js
    let basePath = '';
    const i = uri.lastIndexOf('/');
    if (i !== -1) {
        basePath = uri.substring(0, i + 1);
    }
    return basePath;
}
