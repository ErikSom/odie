import type { LightEntity } from '../../../lighting';
import type { HighFragment } from '../HighFragment';
/**
 * a function that takes a collection of odie lights and returns a HighFragment that
 * can be injected into a shade template to manage the lights
 */
export declare type LightsGenerator = (lights: LightEntity[]) => HighFragment;
/**
 * Similar to `generateLights` but will also compile shadow code too.
 *
 * @param lights - an array of odie light entities to generate code for
 */
export declare function generateLightsWithShadow(lights: LightEntity[]): HighFragment;
/**
 * this will generate a high fragment that will do all the lighting calculations
 * for each light in the scene.
 *
 * @param lights - the in game lights
 */
export declare function generateLights(lights: LightEntity[], receiveShadows?: boolean): HighFragment;
//# sourceMappingURL=generateLights.d.ts.map