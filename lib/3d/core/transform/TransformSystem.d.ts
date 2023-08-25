import type { SystemInterface } from '../../../core/SystemInterface';
export declare class TransformSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    dynamics: number;
    free: number;
    private _tick;
    private readonly _toUpdate;
    private _updateCount;
    constructor();
    render(): void;
    /**
     * makes sure that a world transform is up to date setting updateParents to true
     * will make sure the world transform parents are up to date too.
     * updateParents should only be true outside of the render loop
     *
     * @param entity - then entity
     * @param updateParents - should we update parents too
     */
    private _updateWorld;
    private _updateLocal;
    private _updateWithParent;
    private _updateTransform;
}
//# sourceMappingURL=TransformSystem.d.ts.map