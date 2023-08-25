import type { GBObject } from '@goodboydigital/gb-model-tools';
import type { Entity3D } from '../../3d';
export interface OdieToGbOptions {
    batch?: boolean;
    flatten?: boolean;
    dedupe?: boolean;
    compress?: boolean;
}
/**
 * Converts a odie entity 3D into a GBObject! Magic :D
 * Currently does only supports models and non skinned animations
 *
 * TODO
 * [x] models
 * [x] animation
 * [ ] skins
 * [ ] materials
 * [ ] lights
 * [ ] cameras
 *
 * @param entity - the scene to convert to a GBObject
 * @param options - the compression options
 */
export declare function odieToGbConverter(entity: Entity3D, options?: OdieToGbOptions): GBObject;
//# sourceMappingURL=odieToGbConverter.d.ts.map