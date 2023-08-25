import type { Texture } from 'pixi.js';
import { Entity3D } from '../../core/Entity3D';
import type { ReflectionProbeOptions } from './ReflectionProbeComponent';
import { ReflectionProbeComponent } from './ReflectionProbeComponent';
import { RenderGroupComponent } from './RenderGroupComponent';
export declare class ReflectionProbeEntity extends Entity3D {
    renderGroup: RenderGroupComponent;
    reflectionProbe: ReflectionProbeComponent;
    constructor(options?: ReflectionProbeOptions);
    get cubeTexture(): Texture;
    get ignoreList(): Entity3D[];
    get renderList(): Entity3D[];
}
//# sourceMappingURL=ReflectionProbeEntity.d.ts.map