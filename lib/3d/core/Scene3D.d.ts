import type { Group } from '../../core/groups/Group';
import { GroupSystem } from '../../core/groups/GroupSystem';
import { Scene } from '../../core/Scene';
import { ContainerSystem } from './container/ContainerSystem';
import type { Entity3D } from './Entity3D';
import { TransformSystem } from './transform/TransformSystem';
import type { View3DSystemOptions } from './view/View3DSystem';
import { View3DSystem } from './view/View3DSystem';
export declare class Scene3D extends Scene {
    container: ContainerSystem;
    group: GroupSystem<Entity3D>;
    transform: TransformSystem;
    view3d: View3DSystem;
    /**
     * for convenience short cut access to groups!
     */
    readonly groups: Record<string, Group<Entity3D>>;
    constructor(options: View3DSystemOptions);
    addChild(...entities: Entity3D[]): void;
    removeChild(...entities: Entity3D[]): void;
}
//# sourceMappingURL=Scene3D.d.ts.map