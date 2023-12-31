/**
 * calculates the modelMatrix of the geometry using
 * the uModelMatrix matrix
 */
export const modelMatrix = {
    name: 'modelMatrix',
    vertex: {
        header: `
            uniform mat4 uModelMatrix;
        `,
        transform: `
            modelMatrix = uModelMatrix;        
        `,
    },
};
/**
 * calculates the modelMatrix of the geometry using
 * an instanced attribute array
 */
export const instancedModelMatrix = {
    name: 'instancedModelMatrix',
    vertex: {
        header: `
            attribute vec4 iModalMatrixRow1;
            attribute vec4 iModalMatrixRow2;
            attribute vec4 iModalMatrixRow3;
            attribute vec4 iModalMatrixRow4;
        `,
        transform: `
            modelMatrix = mat4(iModalMatrixRow1, 
                                iModalMatrixRow2, 
                                iModalMatrixRow3, 
                                iModalMatrixRow4);
        `,
    },
};
