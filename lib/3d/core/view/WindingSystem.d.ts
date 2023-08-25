import type { Entity } from '../../../core/Entity';
import type { SystemInterface } from '../../../core/SystemInterface';
import type { Scene3D } from '../Scene3D';
import type { ViewSubSystemOptions } from '.';
/**
 * system that deals with flipping winding!
 *
 * when rendering to a texture, winding order can end up inverted if a camera matrix is flipped.
 * usually this happens when we flip a camera for rendering to a texture.
 * setting this flip will invert winding calls, so business as usual!
 *
 */
export declare class WindingSystem implements SystemInterface<ViewSubSystemOptions> {
    static DEFAULT_NAME: string;
    scene: Scene3D;
    private _flip;
    private readonly _renderer;
    constructor(_entity: Entity, opts?: ViewSubSystemOptions);
    /**
     * set to true to invert any gl front face winding
     * false for default
     */
    set flip(value: boolean);
    get flip(): boolean;
}
//# sourceMappingURL=WindingSystem.d.ts.map