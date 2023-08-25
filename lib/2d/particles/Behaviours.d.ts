import type { Particle } from './Particle';
export declare type BehaviourOptions = RadialBehaviourOptions;
/** additional options to modify the radial behaviour */
export interface RadialBehaviourOptions {
    /** number of layers in radial group */
    layers?: number;
    /** angular offset per layer */
    angleOffset?: number;
    /** loss of force per layer */
    forceLossPerLayer?: number | 'equal';
}
/**
 * modify the original behaviour of each particle to move in a radial pattern
 * @param particle - current particle
 * @param particleIndex - the current particle's index
 * @param total - total amount of particles
 * @param options - additional options to modify the radial behaviour
 */
export declare function attachRadialBehaviour(particle: Particle, particleIndex: number, total: number, options?: RadialBehaviourOptions): void;
//# sourceMappingURL=Behaviours.d.ts.map