/**
 * creates the normal matrix using a uniform mat3
 */
export const standardNormalMatrix = {
    name: 'standardNormalMatrix',
    vertex: {
        header: `
            uniform mat3 uNormalMatrix;
        `,
    },
};
/**
 * creates the normalMatrix from an instanced array
 */
export const instancedNormalMatrix = {
    name: 'instancedNormalMatrix',
    vertex: {
        header: `
            // TODO test and maybe make a mat3??
            attribute vec3 iNormalMatrixRow1;
            attribute vec3 iNormalMatrixRow2;
            attribute vec3 iNormalMatrixRow3;
        `,
        transform: `
            mat3 uNormalMatrix = mat3(iNormalMatrixRow1, 
                                        iNormalMatrixRow2, 
                                        iNormalMatrixRow3);
        `,
    },
};
/**
 * creates a matrix using the model matrix.
 * much faster! but can look funny on non uniformly scaled geometry.
 */
export const fastNormalMatrix = {
    vertex: {
        transform: `
            mat3 uNormalMatrix = mat3(modelMatrix);
        `,
    },
};
