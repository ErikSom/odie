import type { Matrix, Renderer } from 'pixi.js';
import { Matrix4 } from '../../../../math';
/**
 * takes the 3D projections matrix and applies the 2D container matrix
 * a true fusion of matrix! haha
 *
 * @param projectionMatrix - 3D odie projection matrix from the 3d camera
 * @param containerMatrix - 2D pixi matrix of a container
 *
 */
export declare function applyContainerMatrix(width: number, height: number, projectionMatrix: Matrix4, containerMatrix: Matrix, renderer: Renderer): void;
//# sourceMappingURL=applyContainerMatrix.d.ts.map