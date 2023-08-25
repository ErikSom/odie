import type { Entity } from '../../../core/Entity';
import type { SystemInterface } from '../../../core/SystemInterface';
import { Entity3D } from '../Entity3D';
export declare class ContainerSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    root: Entity3D;
    readonly entity: Entity3D;
    constructor(entity: Entity);
    addedToScene(): void;
    reset(): void;
    entityAddedToScene(entity: Entity): void;
    entityRemovedFromScene(entity: Entity): void;
}
//# sourceMappingURL=ContainerSystem.d.ts.map