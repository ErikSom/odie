import type { Scene3D } from '../../3d/core/Scene3D';
import type { Entity } from '../Entity';
import type { SystemInterface } from '../SystemInterface';
import { Group } from './Group';
export interface GroupSystemOptions {
    groups?: string[];
}
export declare class GroupSystem<T extends Entity = Entity> implements SystemInterface<GroupSystemOptions> {
    static DEFAULT_NAME: string;
    scene: Scene3D;
    groups: Record<string, Group<T>>;
    constructor(_entity: Entity, opts?: GroupSystemOptions);
    entityAddedToScene(entity: Entity): void;
    entityRemovedFromScene(entity: Entity): void;
    initGroups(groupIds: string[]): void;
    find(name: string, groupId?: string): Entity;
    findAll(name: string, groupId?: string): Entity[];
    reset(): void;
    empty(): void;
}
//# sourceMappingURL=GroupSystem.d.ts.map