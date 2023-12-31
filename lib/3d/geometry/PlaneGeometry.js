import { Geometry3D } from './Geometry3D';
/**
 * The Plane allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 *
 * let plane = PlaneGeometry(10, 10, 4, 4);
 *
 * ```
 */
export class PlaneGeometry extends Geometry3D {
    /**
     *
     * @param width - the width of the plane
     * @param height - the height of the plane
     * @param quadWidth - the number of points along the width
     * @param quadHeight - the number of points along the height
     */
    constructor(width = 20, height = 10, quadWidth = 4, quadHeight = 2) {
        super();
        const positions = [];
        const uvs = [];
        const normals = [];
        const indices = [];
        for (let y = 0; y <= quadHeight; ++y) {
            const v = y / quadHeight;
            for (let x = 0; x <= quadWidth; ++x) {
                const u = x / quadWidth;
                positions.push((u * width) - (width / 2), (v * height) - (height / 2), 0);
                uvs.push(u, v);
                normals.push(0, 0, 1);
            }
        }
        const rowSize = (quadWidth + 1);
        for (let y = 0; y < quadHeight; ++y) {
            const rowOffset0 = (y + 0) * rowSize;
            const rowOffset1 = (y + 1) * rowSize;
            for (let x = 0; x < quadWidth; ++x) {
                const offset0 = rowOffset0 + x;
                const offset1 = rowOffset1 + x;
                indices.push(offset0, offset0 + 1, offset1);
                indices.push(offset1, offset0 + 1, offset1 + 1);
            }
        }
        this.addAttribute('aPosition', positions, 3)
            .addAttribute('aNormal', normals, 3)
            .addAttribute('aUv', uvs, 2)
            .addIndex(indices);
    }
}
