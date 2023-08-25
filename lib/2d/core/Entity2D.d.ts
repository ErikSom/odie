import type { Container, ObservablePoint, Transform } from 'pixi.js';
import { Entity } from '../../core/Entity';
import type { Scene2D } from './Scene2D';
import type { View2DComponentOptions } from './view/View2DComponent';
import { View2DComponent } from './view/View2DComponent';
export declare class Entity2D<D = View2DComponentOptions> extends Entity<D, Scene2D> {
    transform: Transform;
    view2d: View2DComponent;
    constructor(view2dData?: View2DComponentOptions);
    get view(): Container;
    get position(): ObservablePoint;
    get scale(): ObservablePoint;
    get rotation(): number;
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    set scaleX(value: number);
    get scaleX(): number;
    set scaleY(value: number);
    get scaleY(): number;
}
//# sourceMappingURL=Entity2D.d.ts.map