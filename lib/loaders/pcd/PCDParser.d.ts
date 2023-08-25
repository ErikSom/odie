/**
 * Description: A Odie loader for PCD ascii and binary files.
 * Ported from Three.js
 *
 * Limitations: Compressed binary files are not supported.
 *
 */
import { Geometry3D } from '../../3d';
/**
 * takes a buffer and reads it as a PCD format
 * it will return a PIXI.Geometry
 *
 * @param data - the loaded data
 */
export declare function PCDParser(data: Uint8Array): Geometry3D;
//# sourceMappingURL=PCDParser.d.ts.map