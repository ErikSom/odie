import { Transform } from 'pixi.js';
import { Matrix4 } from '../../../../math';
const tempTransform = new Transform();
const tempMatrix = new Matrix4();
const tempMatrix2 = new Matrix4();
/**
 * takes the 3D projections matrix and applies the 2D container matrix
 * a true fusion of matrix! haha
 *
 * @param projectionMatrix - 3D odie projection matrix from the 3d camera
 * @param containerMatrix - 2D pixi matrix of a container
 *
 */
export function applyContainerMatrix(width, height, projectionMatrix, containerMatrix, renderer) {
    // we need to reverse the rotation here
    // this is todo with the fact y is flipped in 3D land..
    // TODO i am sure we could probably transpose the matrix or something...
    // but its not important for now as this is not hot code
    containerMatrix.decompose(tempTransform);
    tempTransform.rotation *= -1;
    tempTransform['_localID']++;
    tempTransform.updateLocalTransform();
    containerMatrix = tempTransform.localTransform;
    const renderWidth = renderer.width / renderer.resolution;
    const renderHeight = renderer.height / renderer.resolution;
    const xOffset = -1 + ((containerMatrix.tx / renderWidth) * 2);
    const yOffset = 1 - ((containerMatrix.ty / renderHeight) * 2);
    const transformMatrix = tempMatrix.identity();
    transformMatrix.elements[12] = xOffset;
    transformMatrix.elements[13] = yOffset;
    const rotationScaleMatrix = tempMatrix2.identity();
    const rx = width / renderWidth;
    const ry = height / renderHeight;
    rotationScaleMatrix.elements[0] = containerMatrix.a * rx;
    rotationScaleMatrix.elements[1] = containerMatrix.b * ry;
    rotationScaleMatrix.elements[4] = containerMatrix.c * rx;
    rotationScaleMatrix.elements[5] = containerMatrix.d * ry;
    projectionMatrix.multiply(rotationScaleMatrix);
    // now apply the (premultiply) position..
    const pe = projectionMatrix.elements;
    pe[0] += xOffset * pe[3];
    pe[4] += xOffset * pe[7];
    pe[8] += xOffset * pe[11];
    pe[12] += xOffset * pe[15];
    pe[1] += yOffset * pe[3];
    pe[5] += yOffset * pe[7];
    pe[9] += yOffset * pe[11];
    pe[13] += yOffset * pe[15];
}
