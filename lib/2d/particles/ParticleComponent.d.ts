import type { ParticleContainer } from 'pixi.js';
import { Container } from 'pixi.js';
import type { ComponentInterface, Entity } from '../../core';
import type { Time } from '../../utils';
import type { CustomParticleData } from './Particle';
import { Particle } from './Particle';
export declare type ParticleParent = ParticleContainer | Container;
export interface ParticleComponentOptions {
    /** the container that the particles are attached to
     ** use ParticleContainer when high amount of particles are used
     ** otherwise use a normal Container
    */
    view: ParticleParent;
}
/**
 * A system that deal with the creation and managing of particles
 */
export declare class ParticleComponent implements ComponentInterface<ParticleComponentOptions> {
    /** the container that the particles are attached to */
    view?: ParticleParent;
    /** list of current particles */
    particles: Particle[];
    /** max amount of particles allowed */
    maxParticles: number;
    /** a collection of used particles */
    private readonly _pool;
    /** used to pause the particles */
    private _isPaused;
    constructor(_entity: Entity, options: ParticleComponentOptions);
    /** Get current amount of particles */
    get totalParticles(): number;
    /** Kill all particles attached to the particle system */
    killAll(): void;
    /**
     * Update all particles attached to the particle system
     * @param time - a time class for managing the passage of time from frame to frame within an odie scene.
     */
    update(time: Time): void;
    /**
     * Create a group of particles
     * * if `total` particles to be created plus `this.totalParticles` exceded `this.maxParticles`, no particles will be created
     * @param x - origin position of the particle on the x axis
     * @param y - origin position of the particle on the y axis
     * @param total - total amount of particles to be created
     * @param customData - data to be passed to the particles
     */
    create(x: number, y: number, total?: number, customData?: CustomParticleData): void;
    /**
     * Remove single particle from array and parent
     * @param particle - the particle to be removed
     */
    killParticle(particle: Particle): void;
    set pause(value: boolean);
    get pause(): boolean;
}
//# sourceMappingURL=ParticleComponent.d.ts.map