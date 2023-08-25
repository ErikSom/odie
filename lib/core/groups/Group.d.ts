import { Signal } from 'typed-signals';
import type { Entity } from '../Entity';
export declare class Group<TYPE = Entity> {
    children: TYPE[];
    readonly onAdded: Signal<(ent: TYPE) => void>;
    readonly onRemoved: Signal<(ent: TYPE) => void>;
    constructor(children?: TYPE[]);
    add(item: TYPE): void;
    remove(item: TYPE): boolean;
    contains(item: TYPE): boolean;
    getIndex(item: TYPE): number;
    getItem(index: number): TYPE;
    run(f: (item: TYPE) => void, scope?: any): void;
    empty(): void;
    get length(): number;
}
//# sourceMappingURL=Group.d.ts.map