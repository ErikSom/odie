import { Vector2 } from '../../../math/vector/Vector2';
import { Vector3 } from '../../../math/vector/Vector3';
/**
 * Thanks again three.js, modified to use gl-matrix
 *
 */
function fromArray(out, from, index) {
    out.x = from[index + 0];
    out.y = from[index + 1];
    out.z = from[index + 2];
}
function fromArray2d(out, from, index) {
    out.x = from[index + 0];
    out.y = from[index + 1];
}
function set(out, value1, value2, value3) {
    out.x = value1;
    out.y = value2;
    out.z = value3;
}
/**
 * This will take a gbObject and compute the tangents attribute
 * Tangents are required if we want to use normal maps.
 * Not all models have this attribute data when they are exported
 * If successful a new `tangents` Float32Array will be attached to the gbObject
 *
 * indices, positions, normals and uvs are required to generate the tangents.
 *
 * This function is intended to be used at runtime by odie, but also I plan on pre generating these
 * in our 3d format as its seems like quite a lot of maths to do!
 *
 * @param geometry - the gbObject that we want to add tangants to
 */
export function calculateTangents(geometry) {
    // we already have tangents!
    if (geometry.getAttribute('aTangent')) {
        return;
    }
    const indices = geometry.getIndex().data;
    const positions = geometry.getBuffer('aPosition').data;
    const normals = geometry.getBuffer('aNormal').data;
    const uvs = geometry.getBuffer('aUv').data;
    if (!indices || !normals || !uvs || !positions) {
        throw new Error('gb-tools cannot compute tangents, missing one or more required attributs (uvs, positions, normals, indicies');
    }
    const nVertices = positions.length / 3;
    const tangents = new Float32Array(4 * nVertices);
    geometry.addAttribute('aTangent', tangents);
    const tan1 = [];
    const tan2 = [];
    for (let i = 0; i < nVertices; i++) {
        tan1[i] = new Vector3();
        tan2[i] = new Vector3();
    }
    const vA = new Vector3();
    const vB = new Vector3();
    const vC = new Vector3();
    const uvA = new Vector2();
    const uvB = new Vector2();
    const uvC = new Vector2();
    const sDir = new Vector3();
    const tDir = new Vector3();
    function handleTriangle(a, b, c) {
        fromArray(vA, positions, a * 3);
        fromArray(vB, positions, b * 3);
        fromArray(vC, positions, c * 3);
        fromArray2d(uvA, uvs, a * 2);
        fromArray2d(uvB, uvs, b * 2);
        fromArray2d(uvC, uvs, c * 2);
        const x1 = vB.x - vA.x;
        const x2 = vC.x - vA.x;
        const y1 = vB.y - vA.y;
        const y2 = vC.y - vA.y;
        const z1 = vB.z - vA.z;
        const z2 = vC.z - vA.z;
        const s1 = uvB.x - uvA.x;
        const s2 = uvC.x - uvA.x;
        const t1 = uvB.y - uvA.y;
        const t2 = uvC.y - uvA.y;
        const r = 1.0 / ((s1 * t2) - (s2 * t1));
        set(sDir, ((t2 * x1) - (t1 * x2)) * r, ((t2 * y1) - (t1 * y2)) * r, ((t2 * z1) - (t1 * z2)) * r);
        set(tDir, ((s1 * x2) - (s2 * x1)) * r, ((s1 * y2) - (s2 * y1)) * r, ((s1 * z2) - (s2 * z1)) * r);
        tan1[a].add(sDir);
        tan1[b].add(sDir);
        tan1[c].add(sDir);
        tan2[a].add(tDir);
        tan2[b].add(tDir);
        tan2[c].add(tDir);
    }
    let groups = geometry.groups || [];
    if (groups.length === 0) {
        groups = [{
                start: 0,
                count: indices.length,
            }];
    }
    for (let i = 0, il = groups.length; i < il; ++i) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        for (let j = start, jl = start + count; j < jl; j += 3) {
            handleTriangle(indices[j + 0], indices[j + 1], indices[j + 2]);
        }
    }
    const tmp = new Vector3();
    const tmp2 = new Vector3();
    const n = new Vector3();
    const n2 = new Vector3();
    let w;
    let t;
    let test;
    function handleVertex(v) {
        fromArray(n, normals, v * 3);
        n2.copy(n);
        t = tan1[v];
        // Gram-Schmidt orthogonalize
        tmp.copy(t);
        tmp.sub(n.multiplyScalar(n.dot(t)));
        tmp.normalize();
        tmp2.crossVectors(n2, t);
        test = tmp2.dot(tan2[v]);
        w = (test < 0.0) ? -1.0 : 1.0;
        tangents[v * 4] = tmp.x;
        tangents[(v * 4) + 1] = tmp.y;
        tangents[(v * 4) + 2] = tmp.z;
        tangents[(v * 4) + 3] = w;
    }
    for (let i = 0, il = groups.length; i < il; ++i) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        for (let j = start, jl = start + count; j < jl; j += 3) {
            handleVertex(indices[j + 0]);
            handleVertex(indices[j + 1]);
            handleVertex(indices[j + 2]);
        }
    }
}
