/**
 * adds GPU skinning transform to the geometry
 */
export const skinningStandard = {
    name: `animation transform`,
    vertex: {
        header: `
            attribute vec4 aBoneWeights;
            attribute vec4 aBoneIndices;

            uniform mat4 uBoneMatrices[23];
        `,
        transform: `
            mat4 boneMatrixX = uBoneMatrices[int(aBoneIndices.x)];
            mat4 boneMatrixY = uBoneMatrices[int(aBoneIndices.y)];
            mat4 boneMatrixZ = uBoneMatrices[int(aBoneIndices.z)];
            mat4 boneMatrixW = uBoneMatrices[int(aBoneIndices.w)];

            mat4 skinMatrix = mat4(0.0);
        
            skinMatrix += aBoneWeights.x * boneMatrixX;
            skinMatrix += aBoneWeights.y * boneMatrixY;
            skinMatrix += aBoneWeights.z * boneMatrixZ;
            skinMatrix += aBoneWeights.w * boneMatrixW;

            worldPosition = skinMatrix * worldPosition;

            #ifdef worldNormal
                worldNormal =  mat3(skinMatrix) * worldNormal;
            #endif
        `,
    },
};
/**
 * this fragment will do the usual skinning, but instead of reading the values from a uniform
 * It will read it from a texture. Technically slower, but there are no bone limits!
 */
export const skinningTexture = {
    name: `animation transform`,
    vertex: {
        header: `
            attribute vec4 aBoneWeights;
            attribute vec4 aBoneIndices;

            uniform float uBoneTextureSize;
            uniform sampler2D uBoneTexture;

            vec4 getMatrixRow(float index, float row)
            {
                float finalIndex = (index*4.) + row;

                float x = mod(finalIndex, uBoneTextureSize);
                float y = floor(finalIndex/uBoneTextureSize);

                return texture2D(uBoneTexture, vec2(x/uBoneTextureSize, y/uBoneTextureSize));
            }

            mat4 getMatrix(float index)
            {
                return mat4(
                    getMatrixRow(index, 0.),
                    getMatrixRow(index, 1.),
                    getMatrixRow(index, 2.),
                    getMatrixRow(index, 3.)
                );
            }
        `,
        transform: `

            mat4 skinMatrix = mat4(0.0);
        
            skinMatrix += aBoneWeights.x * getMatrix(aBoneIndices.x);
            skinMatrix += aBoneWeights.y * getMatrix(aBoneIndices.y);
            skinMatrix += aBoneWeights.z * getMatrix(aBoneIndices.z);
            skinMatrix += aBoneWeights.w * getMatrix(aBoneIndices.w);

            worldPosition = skinMatrix * worldPosition;

            #ifdef worldNormal
                worldNormal =  mat3(skinMatrix) * worldNormal;
            #endif
        `,
    },
};
const cache = {};
/**
 * creates a shader with a specified number of bones to be used.
 * @param boneCount - number of bones to use
 */
export function generateSkinning(boneCount) {
    return cache[boneCount] || (() => {
        cache[boneCount] = {
            name: `animation transform`,
            vertex: {
                header: `
                    attribute vec4 aBoneWeights;
                    attribute vec4 aBoneIndices;
        
                    uniform mat4 uBoneMatrices[${boneCount}];
                `,
                transform: `
                    mat4 boneMatrixX = uBoneMatrices[int(aBoneIndices.x)];
                    mat4 boneMatrixY = uBoneMatrices[int(aBoneIndices.y)];
                    mat4 boneMatrixZ = uBoneMatrices[int(aBoneIndices.z)];
                    mat4 boneMatrixW = uBoneMatrices[int(aBoneIndices.w)];
        
                    mat4 skinMatrix = mat4(0.0);
                
                    skinMatrix += aBoneWeights.x * boneMatrixX;
                    skinMatrix += aBoneWeights.y * boneMatrixY;
                    skinMatrix += aBoneWeights.z * boneMatrixZ;
                    skinMatrix += aBoneWeights.w * boneMatrixW;
        
                    worldPosition = skinMatrix * worldPosition;
                
                    #ifdef worldNormal
                        worldNormal =  mat3(skinMatrix) * worldNormal;
                    #endif
                `,
            },
        };
        return cache[boneCount];
    })();
}
