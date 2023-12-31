import { Geometry } from 'pixi.js';
import { Vector3 } from '../../../math/vector/Vector3';
/**
 * Generate a list of faces based on the geometry provided
 * @param mGeometry - the entity's geometry
 */
export function generateFaces(mGeometry) {
    const geometry = mGeometry.castToBaseGeometry();
    const positions = geometry.getBuffer('aPosition').data;
    const indices = geometry.getIndex().data;
    let startIndex;
    let sizeIndex;
    if (mGeometry instanceof Geometry) {
        startIndex = 0;
        sizeIndex = indices.length;
    }
    else {
        startIndex = mGeometry.start;
        sizeIndex = mGeometry.size;
    }
    const vertices = {};
    for (let i = 0; i < (sizeIndex); i++) {
        const index = indices[(i + startIndex)];
        const positionIndex = index * 3;
        vertices[index] = new Vector3(positions[positionIndex], positions[positionIndex + 1], positions[positionIndex + 2]);
    }
    const faces = [];
    let ia;
    let ib;
    let ic;
    let a;
    let b;
    let c;
    for (let i = 0; i < sizeIndex; i += 3) {
        ia = indices[i + startIndex];
        ib = indices[i + 1 + startIndex];
        ic = indices[i + 2 + startIndex];
        a = vertices[ia];
        b = vertices[ib];
        c = vertices[ic];
        const face = {
            indices: [ia, ib, ic],
            vertices: [a, b, c],
        };
        faces.push(face);
    }
    mGeometry.faces = faces;
    return faces;
}
