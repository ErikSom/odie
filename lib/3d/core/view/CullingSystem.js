const out = [];
/**
 * The CullSystem  (working with Cull) will hide and show
 * entities based on weather or not they are seen by the camera
 *
 * We automatically generate a bounding sphere for the geometry and then cache it.
 *
 * This can improve performance, but the calculation can be expensive so it won't be a magic bullet for
 * huge scenes!
 *
 * This is best used as a precision final layer of culling after some broadphase culling
 */
export class CullingSystem {
    cull(renderables, camera) {
        const frustum = camera.camera.frustum;
        let index = 0;
        for (let i = 0; i < renderables.length; i++) {
            const view3d = renderables[i].view3d;
            if (view3d.frustumCull && frustum.intersectsSphere(view3d.getBoundingSphere())) {
                out[index++] = renderables[i];
            }
        }
        out.length = index;
        return out;
    }
}
CullingSystem.DEFAULT_NAME = 'culling';
