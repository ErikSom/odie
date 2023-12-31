/**
 * An optimized version of the mat3.normalFromMat4
 * @param out - target
 * @param a - the mat4 to extract normals matrix from
 */
export function fastNormalFromMatrix(out, mat) {
    const a = mat.elements;
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const b00 = (a00 * a11) - (a01 * a10);
    const b01 = (a00 * a12) - (a02 * a10);
    const b03 = (a01 * a12) - (a02 * a11);
    let det = (b00 * a22) - (b01 * a21) + (b03 * a20);
    det = 1.0 / det;
    const oe = out.elements;
    oe[0] = ((a11 * a22) - (a12 * a21)) * det;
    oe[1] = ((a12 * a20) - (a10 * a22)) * det;
    oe[2] = ((a10 * a21) - (a11 * a20)) * det;
    oe[3] = ((a02 * a21) - (a01 * a22)) * det;
    oe[4] = ((a00 * a22) - (a02 * a20)) * det;
    oe[5] = ((a01 * a20) - (a00 * a21)) * det;
    oe[6] = b03 * det;
    oe[7] = -b01 * det;
    oe[8] = b00 * det;
    return out;
}
