import { Geometry3D } from './Geometry3D';
/**
 * The Plane allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 * for (let i = 0; i < 20; i++) {
 *     points.push(new PIXI.Point(i * 50, 0));
 * };
 * let Plane = new PIXI.Plane(PIXI.Texture.fromImage("snake.png"), points);
 * ```
 *
 *
 */
export class RingGeometry extends Geometry3D {
    constructor(radius = 200, thickness = 10, totalSegs = 60) {
        super();
        const positions = [];
        const uvs = [];
        const indices = [];
        const normals = [];
        const innerRadius = radius - thickness;
        let count = 0;
        for (let i = 0; i < totalSegs + 1; i++) {
            const angle = (i / (totalSegs)) * Math.PI * 2;
            const sa = Math.sin(angle);
            const ca = Math.cos(angle);
            normals.push(sa, ca);
            positions.push(sa * radius, ca * radius, sa * innerRadius, ca * innerRadius);
            const uvPercent = i / (totalSegs);
            uvs.push(uvPercent, 0, uvPercent, 1);
            indices.push(count++, count++);
        }
        this.addAttribute('aVertexPosition', positions)
            .addAttribute('aTextureCoord', uvs)
            .addIndex(indices);
        this.normals = normals;
    }
}
