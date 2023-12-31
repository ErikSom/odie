import { unpackGBObject } from '@goodboydigital/gb-model-tools';
import { LoaderResource } from 'pixi.js';
import { Cache } from '../Cache';
import { gbToOdieParser } from './gbToOdieParser';
LoaderResource.setExtensionXhrType('gb', LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
// eslint-disable-next-line consistent-return
export function gbLoader(resource, next) {
    if (!resource.data || resource.extension !== 'gb') {
        return next();
    }
    const gbObject = unpackGBObject(resource.data);
    const scene = gbToOdieParser(gbObject);
    Cache.add(resource.url, scene);
    next();
}
