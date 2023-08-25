import type { HighFragment } from '../HighFragment';
/**
 * adds GPU skinning transform to the geometry
 */
export declare const skinningStandard: HighFragment;
/**
 * this fragment will do the usual skinning, but instead of reading the values from a uniform
 * It will read it from a texture. Technically slower, but there are no bone limits!
 */
export declare const skinningTexture: HighFragment;
/**
 * creates a shader with a specified number of bones to be used.
 * @param boneCount - number of bones to use
 */
export declare function generateSkinning(boneCount: number): HighFragment;
//# sourceMappingURL=skinningFragments.d.ts.map