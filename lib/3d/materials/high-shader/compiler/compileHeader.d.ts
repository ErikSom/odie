import type { HighFragment } from '../HighFragment';
export interface CompiledHeader {
    vertex: {
        extensions: string;
        variables: string;
    };
    fragment: {
        extensions: string;
        variables: string;
    };
}
/**
 * generates a header for our shader by combining all the headers in the high fragments
 * returns the vertex and fragment sources to add to the shader.
 * @param highFragments - the highFragments to extract generate a header from
 * @param isWebGL2 - if true output will prefer vertex2 or fragment2 falling back to vertex of fragment if they are not there
 *
 */
export declare function compileHeader(highFragments: HighFragment[], isWebGL2: boolean): CompiledHeader;
//# sourceMappingURL=compileHeader.d.ts.map