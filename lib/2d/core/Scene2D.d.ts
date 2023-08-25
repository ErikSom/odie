import type { Container } from 'pixi.js';
import { GroupSystem } from '../../core/groups';
import { Scene } from '../../core/Scene';
import { PoolSystem } from '../../utils/pool/PoolSystem';
import type { Entity2D } from './Entity2D';
import { View2DSystem } from './view/View2DSystem';
export declare class Scene2D extends Scene {
    pool: PoolSystem;
    group: GroupSystem<Entity2D>;
    view2d: View2DSystem;
    constructor(container: Container);
    addChild(...entities: Entity2D[]): void;
    removeChild(...entities: Entity2D[]): void;
}
//# sourceMappingURL=Scene2D.d.ts.map