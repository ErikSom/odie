import type { ComponentInterface } from './ComponentInterface';
import type { Entity } from './Entity';
export declare class Component<CONSTRUCTOR_OPTIONS = {}> implements ComponentInterface<CONSTRUCTOR_OPTIONS> {
    private static _mapHash;
    data: CONSTRUCTOR_OPTIONS;
    name: string;
    active: boolean;
    readonly entity: Entity;
    protected scene: any;
    constructor(entity: Entity, data?: CONSTRUCTOR_OPTIONS);
    static create(name: string, object: ComponentInterface<void>): new (entity: Entity) => ComponentInterface;
}
//# sourceMappingURL=Component.d.ts.map