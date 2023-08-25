import type { Entity, SystemInterface } from '../../core';
import type { Scene3D } from '../core';
/**
 * this system will allow us to render our scenes in VR!
 * the `activate` function must be called on a user interaction event like a mouse click
 * or it will fail
 *
 * Gotcha:
 * YOU MUST RUN THIS ON HTTPS. WebXR Api does not work on http, the xr session will fail.
 * Using fido build, set the server config `https` property to true and you can dev away!
 *
 * Also this is still a little experimental, but works like a boss on the oculus quest
 *
 * @example
 * ```
 *
 * const scene = new Scene3D(...);
 *
 * const vr = scene.addSystem(VRSystem);
 *
 * button.pointertap = () => {
 *  vr.activate();
 * }
 *
 * ```
 */
export declare class VRSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    /**
     * reference to the scene
     */
    scene: Scene3D;
    /**
     * a camera representing the user position in VR and projection
     */
    private _vrCamera;
    /**
     * the XR session that is going to render our VR scene
    */
    private _session;
    /**
     * the space in which to place the player, currently we only use 'local' which is standard VR
     * for the other options check out here: https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace
    */
    private _referenceSpace;
    /**
     * shortcut to view3DSystem
    */
    private _view3d;
    /**
     * true if VR session is running
    */
    private _active;
    constructor(entity: Entity);
    /**
     * resolve true if VR is available to the user
     * false, if no VR is available
     */
    isSupported(): Promise<boolean>;
    /**
     * attempts to activate the VR mode.
     * resolves true if successful
     */
    activate(): Promise<boolean>;
    /**
     * turn f VR and return to regular muggle mode
     */
    deactivate(): void;
    /**
     * called by the XR session when a frame is ready to render our scene
     *
     * @param _t - time
     * @param frame - the frame information for the VR render
     */
    private _renderVR;
    /**
     * used internally to clean up the VR stuff
     */
    private _cleanup;
}
//# sourceMappingURL=VRSystem.d.ts.map