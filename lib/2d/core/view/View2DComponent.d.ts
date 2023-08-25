import { Container } from 'pixi.js';
import type { ComponentInterface, Entity } from '../../../core';
export interface View2DComponentOptions {
    layer?: string;
    view?: Container;
}
export declare class View2DComponent implements ComponentInterface<View2DComponentOptions> {
    static DEFAULT_NAME: string;
    data: View2DComponentOptions;
    layer: string;
    view: Container;
    constructor(_entity: Entity, data?: View2DComponentOptions);
}
//# sourceMappingURL=View2DComponent.d.ts.map