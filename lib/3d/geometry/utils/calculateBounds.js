import { Box3 } from '../../../math/shapes/Box3';
import { Vector3 } from '../../../math/vector/Vector3';
import { GeometryFragment } from '../GeometryFragment';
/**
 * This will move center the geometry based on its max width / height / depth
 *
 * @param geometry - the geometry to center
 */
export function calculateBounds(geometry) {
    const baseGeometry = geometry.castToBaseGeometry();
    // TODO this could be more elegant..
    const verts = baseGeometry.getBuffer('aPosition').data;
    const interleaved = baseGeometry.getAttribute('aUv')
        && baseGeometry.getBuffer('aUv') === baseGeometry.getBuffer('aPosition');
    const stride = interleaved ? 8 : 3;
    let offset = interleaved ? 2 : 0;
    let total = verts.length / stride;
    if (geometry instanceof GeometryFragment) {
        // TODO: not sure what these are or where they come from
        offset += geometry.attribStart * stride;
        total = geometry.attribSize;
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < total * stride; i += stride) {
        const x = verts[i + offset];
        const y = verts[i + offset + 1];
        const z = verts[i + offset + 2];
        if (x < minX)
            minX = x;
        else if (x > maxX)
            maxX = x;
        if (y < minY)
            minY = y;
        else if (y > maxY)
            maxY = y;
        if (z < minZ)
            minZ = z;
        else if (z > maxZ)
            maxZ = z;
    }
    return new Box3(new Vector3(minX, minY, minZ), new Vector3(maxX, maxY, maxZ));
}
