import type { ComponentInterface } from '../../../core/ComponentInterface';
import type { Entity } from '../../../core/Entity';
import { Matrix4 } from '../../../math/matrix/Matrix4';
import { ObservablePoint3D } from '../../../math/point/ObservablePoint3D';
import { Quaternion } from '../../../math/rotation/Quaternion';
import { Vector3 } from '../../../math/vector/Vector3';
import type { XYZ } from '../../../utils';
import type { ContainerComponent } from '../container/ContainerComponent';
import type { Entity3D } from '../Entity3D';
export interface TransformOptions {
    rotation?: XYZ;
    position?: XYZ;
    scale?: XYZ;
}
export declare class TransformComponent implements ComponentInterface<TransformOptions> {
    static DEFAULT_NAME: string;
    custom: boolean;
    static: boolean;
    parent: {
        transform: TransformComponent;
        container: ContainerComponent;
    };
    position: ObservablePoint3D;
    scale: ObservablePoint3D;
    rotation: ObservablePoint3D;
    worldTransform: Matrix4;
    localTransform: Matrix4;
    quat: Quaternion;
    readonly entity: Entity3D;
    rTick: number;
    rotationDirty: boolean;
    localID: number;
    currentLocalID: number;
    worldID: number;
    parentID: number;
    private _oTick;
    constructor(entity: Entity);
    extractScale(out: Vector3): Vector3;
    /**
     * extracts the rotation matrix from the world transform (this is the global position, not local)
     * @param out - the matrix to write the rotation too
     */
    extractRotation(out: Matrix4): Matrix4;
    extractPosition(out: Vector3): Vector3;
    /**
     * Get the forward position of the object based on rotation, does not included world position
     * @param out - vector to assign the forward position to
     * @returns the forward position of the object
     */
    extractForward(out: Vector3): Vector3;
    addedToScene(): void;
    init(data?: TransformOptions): void;
    reset(): void;
    applyMatrix(matrix: Matrix4): void;
    /**
     * this will make the entity face the target you tell it too.
     *
     * @param targetEntity - the thing to look at! As long as it has x / y / z property
     * @param step - the amount used to simulate a slerp
     */
    lookAt(targetEntity: Vector3 | Entity3D, step?: number): void;
    extractData(): TransformOptions;
    private _onChange;
    private _onRotationChange;
}
//# sourceMappingURL=TransformComponent.d.ts.map