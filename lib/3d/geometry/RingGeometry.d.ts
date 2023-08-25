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
export declare class RingGeometry extends Geometry3D {
    normals: number[];
    constructor(radius?: number, thickness?: number, totalSegs?: number);
}
//# sourceMappingURL=RingGeometry.d.ts.map