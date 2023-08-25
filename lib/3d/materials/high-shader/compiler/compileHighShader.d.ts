import type { HighFragment, ShaderSource } from '../HighFragment';
/**
 * A high template consists of vertex and fragment source
 */
export interface HighTemplate {
    name?: string;
    fragment: string;
    vertex: string;
}
/**
 * This function will take a HighShader template, some High fragments
 * and then merge them in to a shader source.
 *
 * @param isWebGL2 - is this webGL 1 or 2?
 * @param template - the source template that the high fragments will be added to
 * @param fragments - an array of high fragments
 * @param defines - any defines to add to the top of the shader
 */
export declare function compileHighShader(isWebGL2: boolean, template: HighTemplate, fragments: HighFragment[], defines?: string[]): ShaderSource;
//# sourceMappingURL=compileHighShader.d.ts.map