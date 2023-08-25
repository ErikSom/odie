import type { Entity } from '../core';
import { Component } from '../core/Component';
export interface TransformEditData {
    range?: number;
    scaleRange?: number;
}
export declare class TransformEdit extends Component<TransformEditData> {
    static DEFAULT_NAME: string;
    created: boolean;
    constructor(entity: Entity, data?: TransformEditData);
    addedToScene(): void;
    removedFromScene(): void;
}
//# sourceMappingURL=TransformEdit.d.ts.map