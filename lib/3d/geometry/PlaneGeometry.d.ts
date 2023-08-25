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
export declare class PlaneGeometry extends Geometry3D {
    /**
     *
     * @param width - the width of the plane
     * @param height - the height of the plane
     * @param quadWidth - the number of points along the width
     * @param quadHeight - the number of points along the height
     */
    constructor(width?: number, height?: number, quadWidth?: number, quadHeight?: number);
}
//# sourceMappingURL=PlaneGeometry.d.ts.map