/* eslint-disable max-len */
/* eslint-disable max-statements-per-line */
import { Vector3 } from '../vector/Vector3';
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
export class Matrix4 {
    constructor(elements) {
        this.elements = elements || new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }
    // eslint-disable-next-line max-params
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;
        te[0] = n11;
        te[4] = n12;
        te[8] = n13;
        te[12] = n14;
        te[1] = n21;
        te[5] = n22;
        te[9] = n23;
        te[13] = n24;
        te[2] = n31;
        te[6] = n32;
        te[10] = n33;
        te[14] = n34;
        te[3] = n41;
        te[7] = n42;
        te[11] = n43;
        te[15] = n44;
        return this;
    }
    identity() {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    }
    clone() {
        return new Matrix4().fromArray(this.elements);
    }
    copy(m) {
        const te = this.elements;
        const me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        te[9] = me[9];
        te[10] = me[10];
        te[11] = me[11];
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        te[15] = me[15];
        return this;
    }
    copyPosition(m) {
        const te = this.elements;
        const me = m.elements;
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        return this;
    }
    extractBasis(xAxis, yAxis, zAxis) {
        xAxis.setFromMatrixColumn(this, 0);
        yAxis.setFromMatrixColumn(this, 1);
        zAxis.setFromMatrixColumn(this, 2);
        return this;
    }
    makeBasis(xAxis, yAxis, zAxis) {
        this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
        return this;
    }
    extractRotation(m) {
        // this method does not support reflection matrices
        const te = this.elements;
        const me = m.elements;
        const scaleX = 1 / v1.setFromMatrixColumn(m, 0).length();
        const scaleY = 1 / v1.setFromMatrixColumn(m, 1).length();
        const scaleZ = 1 / v1.setFromMatrixColumn(m, 2).length();
        te[0] = me[0] * scaleX;
        te[1] = me[1] * scaleX;
        te[2] = me[2] * scaleX;
        te[3] = 0;
        te[4] = me[4] * scaleY;
        te[5] = me[5] * scaleY;
        te[6] = me[6] * scaleY;
        te[7] = 0;
        te[8] = me[8] * scaleZ;
        te[9] = me[9] * scaleZ;
        te[10] = me[10] * scaleZ;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    }
    makeRotationFromEuler(euler) {
        const te = this.elements;
        const x = euler.x;
        const y = euler.y;
        const z = euler.z;
        const a = Math.cos(x);
        const b = Math.sin(x);
        const c = Math.cos(y);
        const d = Math.sin(y);
        const e = Math.cos(z);
        const f = Math.sin(z);
        if (euler.order === 'XYZ') {
            const ae = a * e;
            const af = a * f;
            const be = b * e;
            const bf = b * f;
            te[0] = c * e;
            te[4] = -c * f;
            te[8] = d;
            te[1] = af + (be * d);
            te[5] = ae - (bf * d);
            te[9] = -b * c;
            te[2] = bf - (ae * d);
            te[6] = be + (af * d);
            te[10] = a * c;
        }
        else if (euler.order === 'YXZ') {
            const ce = c * e;
            const cf = c * f;
            const de = d * e;
            const df = d * f;
            te[0] = ce + (df * b);
            te[4] = (de * b) - cf;
            te[8] = a * d;
            te[1] = a * f;
            te[5] = a * e;
            te[9] = -b;
            te[2] = (cf * b) - de;
            te[6] = df + (ce * b);
            te[10] = a * c;
        }
        else if (euler.order === 'ZXY') {
            const ce = c * e;
            const cf = c * f;
            const de = d * e;
            const df = d * f;
            te[0] = ce - (df * b);
            te[4] = -a * f;
            te[8] = de + (cf * b);
            te[1] = cf + (de * b);
            te[5] = a * e;
            te[9] = df - (ce * b);
            te[2] = -a * d;
            te[6] = b;
            te[10] = a * c;
        }
        else if (euler.order === 'ZYX') {
            const ae = a * e;
            const af = a * f;
            const be = b * e;
            const bf = b * f;
            te[0] = c * e;
            te[4] = (be * d) - af;
            te[8] = (ae * d) + bf;
            te[1] = c * f;
            te[5] = (bf * d) + ae;
            te[9] = (af * d) - be;
            te[2] = -d;
            te[6] = b * c;
            te[10] = a * c;
        }
        else if (euler.order === 'YZX') {
            const ac = a * c;
            const ad = a * d;
            const bc = b * c;
            const bd = b * d;
            te[0] = c * e;
            te[4] = bd - (ac * f);
            te[8] = (bc * f) + ad;
            te[1] = f;
            te[5] = a * e;
            te[9] = -b * e;
            te[2] = -d * e;
            te[6] = (ad * f) + bc;
            te[10] = ac - (bd * f);
        }
        else if (euler.order === 'XZY') {
            const ac = a * c;
            const ad = a * d;
            const bc = b * c;
            const bd = b * d;
            te[0] = c * e;
            te[4] = -f;
            te[8] = d * e;
            te[1] = (ac * f) + bd;
            te[5] = a * e;
            te[9] = (ad * f) - bc;
            te[2] = (bc * f) - ad;
            te[6] = b * e;
            te[10] = (bd * f) + ac;
        }
        // bottom row
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        // last column
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    }
    makeRotationFromQuaternion(q) {
        return this.compose(zero, q, one);
    }
    /**
     * modifies the matrix such that it rotates to look in the direction of the
     * of the target relative to the eye. This on modifies rotation
     * @param eye - the eye position
     * @param center - the target that the eye will look at
     * @param up - which way is up?
     */
    lookAt(eye, target, up) {
        const x = vector;
        const y = vector2;
        const z = vector3;
        const te = this.elements;
        z.subVectors(eye, target);
        if (z.lengthSq() === 0) {
            // eye and target are in the same position
            z.z = 1;
        }
        z.normalize();
        x.crossVectors(up, z);
        if (x.lengthSq() === 0) {
            // up and z are parallel
            if (Math.abs(up.z) === 1) {
                z.x += 0.0001;
            }
            else {
                z.z += 0.0001;
            }
            z.normalize();
            x.crossVectors(up, z);
        }
        x.normalize();
        y.crossVectors(z, x);
        te[0] = x.x;
        te[4] = y.x;
        te[8] = z.x;
        te[1] = x.y;
        te[5] = y.y;
        te[9] = z.y;
        te[2] = x.z;
        te[6] = y.z;
        te[10] = z.z;
        return this;
    }
    /**
     * This lookat function rotates to look at a target but also positions the matrix too
     *
     * @param eye - the eye position
     * @param center - the target that the eye will look at
     * @param up - which way is up?
     */
    lookAtMove(eye, center, up) {
        const te = this.elements;
        let x0;
        let x1;
        let x2;
        let y0;
        let y1;
        let y2;
        let z0;
        let z1;
        let z2;
        let len;
        const eyeX = eye.x;
        const eyeY = eye.y;
        const eyeZ = eye.z;
        const upx = up.x;
        const upy = up.y;
        const upz = up.z;
        const centerX = center.x;
        const centerY = center.y;
        const centerZ = center.z;
        if (Math.abs(eyeX - centerX) < Number.EPSILON
            && Math.abs(eyeY - centerY) < Number.EPSILON
            && Math.abs(eyeZ - centerZ) < Number.EPSILON) {
            return this.identity();
        }
        z0 = eyeX - centerX;
        z1 = eyeY - centerY;
        z2 = eyeZ - centerZ;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = (upy * z2) - (upz * z1);
        x1 = (upz * z0) - (upx * z2);
        x2 = (upx * z1) - (upy * z0);
        len = Math.hypot(x0, x1, x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        y0 = (z1 * x2) - (z2 * x1);
        y1 = (z2 * x0) - (z0 * x2);
        y2 = (z0 * x1) - (z1 * x0);
        len = Math.hypot(y0, y1, y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        te[0] = x0;
        te[1] = y0;
        te[2] = z0;
        te[3] = 0;
        te[4] = x1;
        te[5] = y1;
        te[6] = z1;
        te[7] = 0;
        te[8] = x2;
        te[9] = y2;
        te[10] = z2;
        te[11] = 0;
        te[12] = -((x0 * eyeX) + (x1 * eyeY) + (x2 * eyeZ));
        te[13] = -((y0 * eyeX) + (y1 * eyeY) + (y2 * eyeZ));
        te[14] = -((z0 * eyeX) + (z1 * eyeY) + (z2 * eyeZ));
        te[15] = 1;
        return this;
    }
    multiply(m) {
        return this.multiplyMatrices(this, m);
    }
    premultiply(m) {
        return this.multiplyMatrices(m, this);
    }
    multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        const a11 = ae[0];
        const a12 = ae[4];
        const a13 = ae[8];
        const a14 = ae[12];
        const a21 = ae[1];
        const a22 = ae[5];
        const a23 = ae[9];
        const a24 = ae[13];
        const a31 = ae[2];
        const a32 = ae[6];
        const a33 = ae[10];
        const a34 = ae[14];
        const a41 = ae[3];
        const a42 = ae[7];
        const a43 = ae[11];
        const a44 = ae[15];
        const b11 = be[0];
        const b12 = be[4];
        const b13 = be[8];
        const b14 = be[12];
        const b21 = be[1];
        const b22 = be[5];
        const b23 = be[9];
        const b24 = be[13];
        const b31 = be[2];
        const b32 = be[6];
        const b33 = be[10];
        const b34 = be[14];
        const b41 = be[3];
        const b42 = be[7];
        const b43 = be[11];
        const b44 = be[15];
        te[0] = (a11 * b11) + (a12 * b21) + (a13 * b31) + (a14 * b41);
        te[4] = (a11 * b12) + (a12 * b22) + (a13 * b32) + (a14 * b42);
        te[8] = (a11 * b13) + (a12 * b23) + (a13 * b33) + (a14 * b43);
        te[12] = (a11 * b14) + (a12 * b24) + (a13 * b34) + (a14 * b44);
        te[1] = (a21 * b11) + (a22 * b21) + (a23 * b31) + (a24 * b41);
        te[5] = (a21 * b12) + (a22 * b22) + (a23 * b32) + (a24 * b42);
        te[9] = (a21 * b13) + (a22 * b23) + (a23 * b33) + (a24 * b43);
        te[13] = (a21 * b14) + (a22 * b24) + (a23 * b34) + (a24 * b44);
        te[2] = (a31 * b11) + (a32 * b21) + (a33 * b31) + (a34 * b41);
        te[6] = (a31 * b12) + (a32 * b22) + (a33 * b32) + (a34 * b42);
        te[10] = (a31 * b13) + (a32 * b23) + (a33 * b33) + (a34 * b43);
        te[14] = (a31 * b14) + (a32 * b24) + (a33 * b34) + (a34 * b44);
        te[3] = (a41 * b11) + (a42 * b21) + (a43 * b31) + (a44 * b41);
        te[7] = (a41 * b12) + (a42 * b22) + (a43 * b32) + (a44 * b42);
        te[11] = (a41 * b13) + (a42 * b23) + (a43 * b33) + (a44 * b43);
        te[15] = (a41 * b14) + (a42 * b24) + (a43 * b34) + (a44 * b44);
        return this;
    }
    multiplyScalar(s) {
        const te = this.elements;
        te[0] *= s;
        te[4] *= s;
        te[8] *= s;
        te[12] *= s;
        te[1] *= s;
        te[5] *= s;
        te[9] *= s;
        te[13] *= s;
        te[2] *= s;
        te[6] *= s;
        te[10] *= s;
        te[14] *= s;
        te[3] *= s;
        te[7] *= s;
        te[11] *= s;
        te[15] *= s;
        return this;
    }
    // TODO make an Odie version
    // applyToBufferAttribute(attribute)
    // {
    // 	for (let i = 0, l = attribute.count; i < l; i++)
    //     {
    // 		v1.x = attribute.getX(i);
    // 		v1.y = attribute.getY(i);
    // 		v1.z = attribute.getZ(i);
    // 		v1.applyMatrix4(this);
    // 		attribute.setXYZ(i, v1.x, v1.y, v1.z);
    // 	}
    // 	return attribute;
    // }
    determinant() {
        const te = this.elements;
        const n11 = te[0];
        const n12 = te[4];
        const n13 = te[8];
        const n14 = te[12];
        const n21 = te[1];
        const n22 = te[5];
        const n23 = te[9];
        const n24 = te[13];
        const n31 = te[2];
        const n32 = te[6];
        const n33 = te[10];
        const n34 = te[14];
        const n41 = te[3];
        const n42 = te[7];
        const n43 = te[11];
        const n44 = te[15];
        // TODO: make this more efficient
        // ( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
        return ((n41 * ((n14 * n23 * n32)
            - (n13 * n24 * n32)
            - (n14 * n22 * n33)
            + (n12 * n24 * n33)
            + (n13 * n22 * n34)
            - (n12 * n23 * n34)))
            + (n42 * ((n11 * n23 * n34)
                - (n11 * n24 * n33)
                + (n14 * n21 * n33)
                - (n13 * n21 * n34)
                + (n13 * n24 * n31)
                - (n14 * n23 * n31)))
            + (n43 * ((n11 * n24 * n32)
                - (n11 * n22 * n34)
                - (n14 * n21 * n32)
                + (n12 * n21 * n34)
                + (n14 * n22 * n31)
                - (n12 * n24 * n31)))
            + (n44 * ((-n13 * n22 * n31)
                - (n11 * n23 * n32)
                + (n11 * n22 * n33)
                + (n13 * n21 * n32)
                - (n12 * n21 * n33)
                + (n12 * n23 * n31))));
    }
    transpose() {
        const te = this.elements;
        let tmp;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
    }
    setPosition(v) {
        const te = this.elements;
        te[12] = v.x;
        te[13] = v.y;
        te[14] = v.z;
        return this;
    }
    extractPosition(out) {
        const te = this.elements;
        out.x = te[12];
        out.y = te[13];
        out.z = te[14];
        return out;
    }
    /**
     * Get the forward position of the matrix based on rotation
     * @param out - vector to assign the forward position to
     * @returns the forward postion of the matrix
     */
    /*
    // This function looks more like extracting up than forward.
    // COmmenting aout in favour of already set extract orientation functions
    extractForward(out: Vector3): Vector3
    {
        const te = this.elements;

        out.x = te[4];
        out.y = te[5];
        out.z = te[6];

        out.setLength(-1);

        return out;
    }
    */
    getInverse(m, throwOnDegenerate) {
        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        const te = this.elements;
        const me = m.elements;
        const n11 = me[0];
        const n21 = me[1];
        const n31 = me[2];
        const n41 = me[3];
        const n12 = me[4];
        const n22 = me[5];
        const n32 = me[6];
        const n42 = me[7];
        const n13 = me[8];
        const n23 = me[9];
        const n33 = me[10];
        const n43 = me[11];
        const n14 = me[12];
        const n24 = me[13];
        const n34 = me[14];
        const n44 = me[15];
        const t11 = (n23 * n34 * n42) - (n24 * n33 * n42) + (n24 * n32 * n43) - (n22 * n34 * n43) - (n23 * n32 * n44) + (n22 * n33 * n44);
        const t12 = (n14 * n33 * n42) - (n13 * n34 * n42) - (n14 * n32 * n43) + (n12 * n34 * n43) + (n13 * n32 * n44) - (n12 * n33 * n44);
        const t13 = (n13 * n24 * n42) - (n14 * n23 * n42) + (n14 * n22 * n43) - (n12 * n24 * n43) - (n13 * n22 * n44) + (n12 * n23 * n44);
        const t14 = (n14 * n23 * n32) - (n13 * n24 * n32) - (n14 * n22 * n33) + (n12 * n24 * n33) + (n13 * n22 * n34) - (n12 * n23 * n34);
        const det = (n11 * t11) + (n21 * t12) + (n31 * t13) + (n41 * t14);
        if (det === 0) {
            const msg = 'ODIE.Matrix4: .getInverse() can\'t invert matrix, determinant is 0';
            if (throwOnDegenerate === true) {
                throw new Error(msg);
            }
            else {
                console.warn(msg);
            }
            return this.identity();
        }
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = ((n24 * n33 * n41) - (n23 * n34 * n41) - (n24 * n31 * n43) + (n21 * n34 * n43) + (n23 * n31 * n44) - (n21 * n33 * n44)) * detInv;
        te[2] = ((n22 * n34 * n41) - (n24 * n32 * n41) + (n24 * n31 * n42) - (n21 * n34 * n42) - (n22 * n31 * n44) + (n21 * n32 * n44)) * detInv;
        te[3] = ((n23 * n32 * n41) - (n22 * n33 * n41) - (n23 * n31 * n42) + (n21 * n33 * n42) + (n22 * n31 * n43) - (n21 * n32 * n43)) * detInv;
        te[4] = t12 * detInv;
        te[5] = ((n13 * n34 * n41) - (n14 * n33 * n41) + (n14 * n31 * n43) - (n11 * n34 * n43) - (n13 * n31 * n44) + (n11 * n33 * n44)) * detInv;
        te[6] = ((n14 * n32 * n41) - (n12 * n34 * n41) - (n14 * n31 * n42) + (n11 * n34 * n42) + (n12 * n31 * n44) - (n11 * n32 * n44)) * detInv;
        te[7] = ((n12 * n33 * n41) - (n13 * n32 * n41) + (n13 * n31 * n42) - (n11 * n33 * n42) - (n12 * n31 * n43) + (n11 * n32 * n43)) * detInv;
        te[8] = t13 * detInv;
        te[9] = ((n14 * n23 * n41) - (n13 * n24 * n41) - (n14 * n21 * n43) + (n11 * n24 * n43) + (n13 * n21 * n44) - (n11 * n23 * n44)) * detInv;
        te[10] = ((n12 * n24 * n41) - (n14 * n22 * n41) + (n14 * n21 * n42) - (n11 * n24 * n42) - (n12 * n21 * n44) + (n11 * n22 * n44)) * detInv;
        te[11] = ((n13 * n22 * n41) - (n12 * n23 * n41) - (n13 * n21 * n42) + (n11 * n23 * n42) + (n12 * n21 * n43) - (n11 * n22 * n43)) * detInv;
        te[12] = t14 * detInv;
        te[13] = ((n13 * n24 * n31) - (n14 * n23 * n31) + (n14 * n21 * n33) - (n11 * n24 * n33) - (n13 * n21 * n34) + (n11 * n23 * n34)) * detInv;
        te[14] = ((n14 * n22 * n31) - (n12 * n24 * n31) - (n14 * n21 * n32) + (n11 * n24 * n32) + (n12 * n21 * n34) - (n11 * n22 * n34)) * detInv;
        te[15] = ((n12 * n23 * n31) - (n13 * n22 * n31) + (n13 * n21 * n32) - (n11 * n23 * n32) - (n12 * n21 * n33) + (n11 * n22 * n33)) * detInv;
        return this;
    }
    scale(v) {
        const te = this.elements;
        const x = v.x;
        const y = v.y;
        const z = v.z;
        te[0] *= x;
        te[4] *= y;
        te[8] *= z;
        te[1] *= x;
        te[5] *= y;
        te[9] *= z;
        te[2] *= x;
        te[6] *= y;
        te[10] *= z;
        te[3] *= x;
        te[7] *= y;
        te[11] *= z;
        return this;
    }
    extractScale(out) {
        const te = this.elements;
        out.x = vector.set(te[0], te[1], te[2]).length();
        out.y = vector.set(te[4], te[5], te[6]).length();
        out.y = vector.set(te[8], te[9], te[10]).length();
        return out;
    }
    getMaxScaleOnAxis() {
        const te = this.elements;
        const scaleXSq = (te[0] * te[0]) + (te[1] * te[1]) + (te[2] * te[2]);
        const scaleYSq = (te[4] * te[4]) + (te[5] * te[5]) + (te[6] * te[6]);
        const scaleZSq = (te[8] * te[8]) + (te[9] * te[9]) + (te[10] * te[10]);
        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }
    makeTranslation(x, y, z) {
        this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        return this;
    }
    makeRotationX(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
        return this;
    }
    makeRotationY(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
        return this;
    }
    makeRotationZ(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    }
    makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const tx = t * x;
        const ty = t * y;
        this.set((tx * x) + c, (tx * y) - (s * z), (tx * z) + (s * y), 0, (tx * y) + (s * z), (ty * y) + c, (ty * z) - (s * x), 0, (tx * z) - (s * y), (ty * z) + (s * x), (t * z * z) + c, 0, 0, 0, 0, 1);
        return this;
    }
    makeScale(x, y, z) {
        this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
        return this;
    }
    makeShear(x, y, z) {
        this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
        return this;
    }
    compose(position, quaternion, scale) {
        const te = this.elements;
        const x = quaternion.x;
        const y = quaternion.y;
        const z = quaternion.z;
        const w = quaternion.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const sx = scale.x;
        const sy = scale.y;
        const sz = scale.z;
        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;
        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;
        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;
        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;
        return this;
    }
    decompose(position, quaternion, scale) {
        const te = this.elements;
        let sx = vector.set(te[0], te[1], te[2]).length();
        const sy = vector.set(te[4], te[5], te[6]).length();
        const sz = vector.set(te[8], te[9], te[10]).length();
        // if determine is negative, we need to invert one scale
        const det = this.determinant();
        if (det < 0)
            sx = -sx;
        position.x = te[12];
        position.y = te[13];
        position.z = te[14];
        // scale the rotation part
        matrix.copy(this);
        const invSX = 1 / sx;
        const invSY = 1 / sy;
        const invSZ = 1 / sz;
        matrix.elements[0] *= invSX;
        matrix.elements[1] *= invSX;
        matrix.elements[2] *= invSX;
        matrix.elements[4] *= invSY;
        matrix.elements[5] *= invSY;
        matrix.elements[6] *= invSY;
        matrix.elements[8] *= invSZ;
        matrix.elements[9] *= invSZ;
        matrix.elements[10] *= invSZ;
        // TODO do we want to make rotations.. q driven instead of euler?
        quaternion.setFromRotationMatrix(matrix);
        scale.x = sx;
        scale.y = sy;
        scale.z = sz;
        return this;
    }
    makePerspective(fovy, aspect, near, far) {
        const te = this.elements;
        const f = 1.0 / Math.tan(fovy / 2);
        let nf;
        te[0] = f / aspect;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = f;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        te[9] = 0;
        te[11] = -1;
        te[12] = 0;
        te[13] = 0;
        te[15] = 0;
        if (far !== undefined && far !== Infinity) {
            nf = 1 / (near - far);
            te[10] = (far + near) * nf;
            te[14] = (2 * far * near) * nf;
        }
        else {
            te[10] = -1;
            te[14] = -2 * near;
        }
        return this;
    }
    makeOrthographic(left, right, top, bottom, near, far) {
        const te = this.elements;
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        te[0] = -2 * lr;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = -2 * bt;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        te[9] = 0;
        te[10] = 2 * nf;
        te[11] = 0;
        te[12] = (left + right) * lr;
        te[13] = (top + bottom) * bt;
        te[14] = (far + near) * nf;
        te[15] = 1;
        return this;
    }
    equals(matrix) {
        const te = this.elements;
        const me = matrix.elements;
        for (let i = 0; i < 16; i++) {
            if (te[i] !== me[i])
                return false;
        }
        return true;
    }
    fromArray(array, offset) {
        if (offset === undefined)
            offset = 0;
        for (let i = 0; i < 16; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }
    toArray(array, offset) {
        if (array === undefined)
            array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (offset === undefined)
            offset = 0;
        const te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];
        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];
        return array;
    }
    log() {
        const e = this.elements;
        // eslint-disable-next-line no-console
        if (console.table) {
            // eslint-disable-next-line no-console
            console.table([
                [e[0], e[1], e[2], e[3]],
                [e[4], e[5], e[6], e[7]],
                [e[8], e[9], e[10], e[11]],
                [e[12], e[13], e[14], e[15]],
            ]);
        }
    }
    /**
     * reflects the matrix using a plane (imagine it was a bit mirror!)
     * @param plane - the plane to reflect he matrix on
     */
    reflectOnPlane(plane) {
        const a = plane.normal.x;
        const b = plane.normal.y;
        const c = plane.normal.z;
        const d = plane.constant;
        const e = matrix.elements;
        e[0] = 1 - (2 * a * a);
        e[4] = -2 * a * b;
        e[8] = -2 * a * c;
        e[12] = -2 * a * d;
        e[1] = -2 * a * b;
        e[5] = 1 - (2 * b * b);
        e[9] = -2 * b * c;
        e[13] = -2 * b * d;
        e[2] = -2 * a * c;
        e[6] = -2 * b * c;
        e[10] = 1 - (2 * c * c);
        e[14] = -2 * c * d;
        e[3] = 0.0;
        e[7] = 0.0;
        e[11] = 0.0;
        e[15] = 1.0;
        return this.multiply(matrix);
    }
    /**
     * Extract a vector representing FORWARD orientation
     * From identity matrix will be Vector3(0, 0, -1)
     * @param out - Vector that will receive XYZ values
     */
    extractForward(out) {
        out.x = this.elements[8];
        out.y = this.elements[9];
        out.z = this.elements[10];
        out.setLength(-1);
        return out;
    }
    /**
     * Extract a vector representing RIGHT orientation
     * From identity matrix will be Vector3(1, 0, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractRight(out) {
        out.x = this.elements[0];
        out.y = this.elements[1];
        out.z = this.elements[2];
        out.setLength(1);
        return out;
    }
    /**
     * Extract a vector representing UP orientation
     * From identity matrix will be Vector3(0, 1, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractUp(out) {
        out.x = this.elements[4];
        out.y = this.elements[5];
        out.z = this.elements[6];
        out.setLength(1);
        return out;
    }
    /**
     * Extract a vector representing BACK orientation
     * From identity matrix will be Vector3(0, 0, 1)
     * @param out - Vector that will receive XYZ values
     */
    extractBack(out) {
        this.extractForward(out);
        out.multiplyScalar(-1);
        return out;
    }
    /**
     * Extract a vector representing LEFT orientation
     * From identity matrix will be Vector3(-1, 0, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractLeft(out) {
        this.extractRight(out);
        out.multiplyScalar(-1);
        return out;
    }
    /**
     * Extract a vector representing DOWN orientation
     * From identity matrix will be Vector3(0, -1, 0)
     * @param out - Vector that will receive XYZ values
     */
    extractDown(out) {
        this.extractUp(out);
        out.multiplyScalar(-1);
        return out;
    }
}
const vector = new Vector3();
const vector2 = new Vector3();
const vector3 = new Vector3();
const matrix = new Matrix4();
const v1 = new Vector3();
const zero = new Vector3(0, 0, 0);
const one = new Vector3(1, 1, 1);
