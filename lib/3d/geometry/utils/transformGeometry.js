export function transformGeometry(geometry, transform, interleaved = true) {
    const verts = geometry.getAttribute('position').data;
    if (transform.length === 3) {
        if (interleaved) {
            for (let i = 0; i < verts.length; i += 8) {
                verts[i + 2] += transform[0];
                verts[i + 1 + 2] += transform[1];
                verts[i + 2 + 2] += transform[2];
            }
        }
        else {
            for (let i = 0; i < verts.length; i += 3) {
                verts[i] += transform[0];
                verts[i + 1] += transform[1];
                verts[i + 2] += transform[2];
            }
        }
    }
    geometry.getAttribute('position').update();
}
