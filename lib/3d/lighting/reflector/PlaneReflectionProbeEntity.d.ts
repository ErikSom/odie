import type { Texture } from 'pixi.js';
import { Entity3D } from '../../core/Entity3D';
import type { PlaneReflectionProbeOptions } from './PlaneReflectionProbeComponent';
import { PlaneReflectionProbeComponent } from './PlaneReflectionProbeComponent';
import { RenderGroupComponent } from './RenderGroupComponent';
export declare class PlaneReflectionProbeEntity extends Entity3D {
    renderGroup: RenderGroupComponent;
    reflectionProbe: PlaneReflectionProbeComponent;
    constructor(options?: PlaneReflectionProbeOptions);
    get reflection(): Texture;
    get refraction(): Texture;
    get ignoreList(): Entity3D[];
    get renderList(): Entity3D[];
}
//# sourceMappingURL=PlaneReflectionProbeEntity.d.ts.map