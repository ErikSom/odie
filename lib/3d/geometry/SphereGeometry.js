import { Geometry3D } from './Geometry3D';
export class SphereGeometry extends Geometry3D {
    constructor(radius, widthSegments = 8, heightSegments = 6, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {
        super();
        this.type = 'SphereBufferGeometry';
        radius = radius || 1;
        widthSegments = Math.max(3, Math.floor(widthSegments));
        heightSegments = Math.max(2, Math.floor(heightSegments));
        const thetaEnd = thetaStart + thetaLength;
        let ix;
        let iy;
        let index = 0;
        const grid = [];
        // buffers
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];
        // generate vertices, normals and uvs
        for (iy = 0; iy <= heightSegments; iy++) {
            const verticesRow = [];
            const v = iy / heightSegments;
            for (ix = 0; ix <= widthSegments; ix++) {
                const u = ix / widthSegments;
                // vertex
                const x = -radius * Math.cos(phiStart + (u * phiLength)) * Math.sin(thetaStart + (v * thetaLength));
                const y = radius * Math.cos(thetaStart + (v * thetaLength));
                const z = radius * Math.sin(phiStart + (u * phiLength)) * Math.sin(thetaStart + (v * thetaLength));
                vertices.push(x, y, z);
                // normal
                let len = (x * x) + (y * y) + (z * z);
                if (len > 0) {
                    // TODO: evaluate use of glm_invsqrt here?
                    len = 1 / Math.sqrt(len);
                }
                normals.push(x * len, y * len, z * len);
                // uv
                uvs.push(u, 1 - v);
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }
        // indices
        for (iy = 0; iy < heightSegments; iy++) {
            for (ix = 0; ix < widthSegments; ix++) {
                const a = grid[iy][ix + 1];
                const b = grid[iy][ix];
                const c = grid[iy + 1][ix];
                const d = grid[iy + 1][ix + 1];
                if (iy !== 0 || thetaStart > 0)
                    indices.push(a, b, d);
                if (iy !== heightSegments - 1 || thetaEnd < Math.PI)
                    indices.push(b, c, d);
            }
        }
        // build geometry
        this.addAttribute('aUv', uvs, 2)
            .addAttribute('aPosition', vertices, 3)
            .addAttribute('aNormal', normals, 3)
            .interleave()
            .addIndex(new Uint16Array(indices));
    }
}
