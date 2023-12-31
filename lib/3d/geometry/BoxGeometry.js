import { Geometry3D } from './Geometry3D';
// BoxGeometry
export class BoxGeometry extends Geometry3D {
    constructor(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        super();
        // segments
        widthSegments = Math.floor(widthSegments);
        heightSegments = Math.floor(heightSegments);
        depthSegments = Math.floor(depthSegments);
        // buffers
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];
        // helper variables
        let numberOfVertices = 0;
        // build each side of the box geometry
        buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments); // px
        buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments); // nx
        buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments); // py
        buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments); // ny
        buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments); // pz
        buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments); // nz
        this.addAttribute('aUv', uvs, 2)
            .addAttribute('aPosition', vertices, 3)
            .addAttribute('aNormal', normals, 3)
            .addIndex(new Uint16Array(indices));
        function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY) {
            const segmentWidth = width / gridX;
            const segmentHeight = height / gridY;
            const widthHalf = width / 2;
            const heightHalf = height / 2;
            const depthHalf = depth / 2;
            const gridX1 = gridX + 1;
            const gridY1 = gridY + 1;
            let vertexCounter = 0;
            let ix;
            let iy;
            const vector = { x: 0, y: 0, z: 0 };
            // generate vertices, normals and uvs
            for (iy = 0; iy < gridY1; iy++) {
                const y = (iy * segmentHeight) - heightHalf;
                for (ix = 0; ix < gridX1; ix++) {
                    const x = (ix * segmentWidth) - widthHalf;
                    // set values to correct vector component
                    vector[u] = x * udir;
                    vector[v] = y * vdir;
                    vector[w] = depthHalf;
                    // now apply vector to vertex buffer
                    vertices.push(vector.x, vector.y, vector.z);
                    // set values to correct vector component
                    vector[u] = 0;
                    vector[v] = 0;
                    vector[w] = depth > 0 ? 1 : -1;
                    // now apply vector to normal buffer
                    normals.push(vector.x, vector.y, vector.z);
                    // uvs
                    uvs.push(ix / gridX);
                    uvs.push(1 - (iy / gridY));
                    // counters
                    vertexCounter += 1;
                }
            }
            // indices
            // 1. you need three indices to draw a single face
            // 2. a single segment consists of two faces
            // 3. so we need to generate six (2*3) indices per segment
            for (iy = 0; iy < gridY; iy++) {
                for (ix = 0; ix < gridX; ix++) {
                    const a = numberOfVertices + ix + (gridX1 * iy);
                    const b = numberOfVertices + ix + (gridX1 * (iy + 1));
                    const c = numberOfVertices + (ix + 1) + (gridX1 * (iy + 1));
                    const d = numberOfVertices + (ix + 1) + (gridX1 * iy);
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
            numberOfVertices += vertexCounter;
        }
    }
}
