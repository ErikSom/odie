import { Entity } from '../../core/Entity';
import type { ObservablePoint3D } from '../../math/point/ObservablePoint3D';
import type { SkinnedComponent } from '../animation/SkinnedComponent';
import { ContainerComponent } from './container/ContainerComponent';
import type { Scene3D } from './Scene3D';
import { TransformComponent } from './transform/TransformComponent';
import type { View3DComponentOptions } from './view/View3DComponent';
import { View3DComponent } from './view/View3DComponent';
export declare class Entity3D<D = View3DComponentOptions> extends Entity<D, Scene3D> {
    view3d?: View3DComponent;
    transform: TransformComponent;
    container: ContainerComponent;
    skinned?: SkinnedComponent;
    /**
     * used internally in the engine to know if this entity needs / updating or rendering
     */
    _worldActive: boolean;
    private _active;
    constructor(view3dData?: View3DComponentOptions);
    addChild(...entities: Entity3D[]): void;
    removeChild(...entities: Entity3D[]): void;
    removeChildren(): void;
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    set z(value: number);
    get z(): number;
    set sx(value: number);
    get sx(): number;
    set sy(value: number);
    get sy(): number;
    set sz(value: number);
    get sz(): number;
    set rx(value: number);
    get rx(): number;
    set ry(value: number);
    get ry(): number;
    set rz(value: number);
    get rz(): number;
    get position(): ObservablePoint3D;
    get scale(): ObservablePoint3D;
    get rotation(): ObservablePoint3D;
    set active(value: boolean);
    get active(): boolean;
    get parent(): Entity3D;
}
//# sourceMappingURL=Entity3D.d.ts.map