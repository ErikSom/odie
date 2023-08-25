import type { ComponentInterface } from '../../../core/ComponentInterface';
import type { Entity } from '../../../core/Entity';
import type { Entity3D } from '../Entity3D';
declare type Nullable<T> = T | null;
export declare class ContainerComponent implements ComponentInterface {
    static DEFAULT_NAME: string;
    children: Entity3D[];
    parent: Nullable<Entity3D>;
    readonly entity: Entity3D;
    constructor(entity: Entity);
    empty(): void;
    traverse(callback: (entity: Entity3D) => void): void;
    add(childEntity: Entity3D): void;
    removeAll(): void;
    remove(childEntity: Entity3D): void;
}
export {};
//# sourceMappingURL=ContainerComponent.d.ts.map