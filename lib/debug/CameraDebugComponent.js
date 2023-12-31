import { DRAW_MODES, Rectangle } from 'pixi.js';
import { Entity3D } from '../3d/core/Entity3D';
import { Geometry3D } from '../3d/geometry/Geometry3D';
import { DebugMaterial } from '../3d/materials/debug';
import { Matrix4, Vector3 } from '../math';
/**
 * The cull component (working with CullingSystem) will hide and show
 * entities based on weather or not they are seen by the camera
 *
 * We automatically generate a bounding sphere for the geometry and then cache it.
 *
 * This can improve performance, but the calculation can be expensive so it won't be a magic bullet for
 * huge scenes!
 *
 * This is best used as a precision final layer of culling after some broad phase culling
 */
export class CameraDebugComponent {
    /**
     *
     * @param entity - the entity the component will be added to
     * @param data - options for this component
     */
    constructor(entity) {
        this.entity = entity;
        const geometry = new Geometry3D();
        geometry.addAttribute('position', new Float32Array((8 + 4 + 1) * 3))
            .addAttribute('color', new Float32Array((8 + 4 + 1) * 3 * 3));
        geometry
            .addIndex([
            // square one..
            0, 1,
            0, 2,
            2, 3,
            1, 3,
            // square two
            4, 5,
            4, 6,
            6, 7,
            5, 7,
            // connectors..
            0, 4,
            2, 6,
            3, 7,
            1, 5,
            8, 12,
            9, 12,
            10, 12,
            11, 12,
        ]);
        const material = new DebugMaterial(0xFFFFFF);
        const frustumView = new Entity3D({
            geometry,
            material,
            draw: DRAW_MODES.LINES,
            frustumCull: false,
        });
        this.frustumView = frustumView;
    }
    addedToScene(scene) {
        scene.addChild(this.frustumView);
    }
    // TODO find a better game type
    removedFromScene(scene) {
        scene.removeChild(this.frustumView);
    }
    render() {
        const verts = this.frustumView.view3d.geometry.getBuffer('position').data;
        const colors = this.frustumView.view3d.geometry.getBuffer('color').data;
        const cameraC = this.entity.camera;
        const w = this.entity.scene.width;
        const h = this.entity.scene.height;
        cameraC.updateProjection(w, h);
        const viewProj = new Matrix4();
        viewProj.multiplyMatrices(cameraC.projection, cameraC.view);
        const invProjectionView = viewProj.getInverse(viewProj);
        const viewPort = new Rectangle(0, 0, w, h);
        // TODO optimise this! .. too much new
        const corners = [
            new Vector3().unproject(new Vector3(0, 0, 0), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(w, 0, 0), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(0, h, 0), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(w, h, 0), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(0, 0, 1), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(w, 0, 1), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(0, h, 1), viewPort, invProjectionView),
            new Vector3().unproject(new Vector3(w, h, 1), viewPort, invProjectionView),
        ];
        let index = 0;
        let color = 0;
        for (let i = 0; i < corners.length; i++) {
            const v = corners[i];
            verts[index++] = v.x;
            verts[index++] = v.y;
            verts[index++] = v.z;
            colors[color++] = 1;
            colors[color++] = 1;
            colors[color++] = 0;
        }
        for (let i = 0; i < 4; i++) {
            const v = corners[i];
            verts[index++] = v.x;
            verts[index++] = v.y;
            verts[index++] = v.z;
            colors[color++] = 1;
            colors[color++] = 0;
            colors[color++] = 0;
        }
        const wt = this.entity.transform.worldTransform.elements;
        verts[index++] = wt[12];
        verts[index++] = wt[13];
        verts[index++] = wt[14];
        colors[color++] = 1;
        colors[color++] = 0;
        colors[color++] = 0;
        this.frustumView.view3d.geometry.getBuffer('position').update();
        this.frustumView.view3d.geometry.getBuffer('color').update();
    }
}
CameraDebugComponent.DEFAULT_NAME = 'cameraDebug';
