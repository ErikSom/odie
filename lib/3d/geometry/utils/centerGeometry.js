/**
 * This will move center the geometry based on its max width / height / depth
 *
 * @param geometry - the geometry to center
 */
export function centerGeometry(geometry) {
    const verts = geometry.getBuffer('position').data;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    let i;
    for (i = 0; i < verts.length; i += 3) {
        const x = verts[i];
        const y = verts[i + 1];
        const z = verts[i + 2];
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
    const xSize = maxX - minX;
    const ySize = maxY - minY;
    const zSize = maxZ - minZ;
    for (i = 0; i < verts.length; i += 3) {
        verts[i] -= minX + (xSize / 2);
        verts[i + 1] -= minY + (ySize / 2);
        verts[i + 2] -= minZ + (zSize / 2);
    }
}
