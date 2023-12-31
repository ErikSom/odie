import { Container } from 'pixi.js';
import { attachRadialBehaviour } from './Behaviours';
import { Particle } from './Particle';
/**
 * A system that deal with the creation and managing of particles
 */
export class ParticleComponent {
    constructor(_entity, options) {
        this.particles = [];
        this._pool = [];
        this.maxParticles = 1000;
        this.view = (options === null || options === void 0 ? void 0 : options.view) || new Container();
    }
    /** Get current amount of particles */
    get totalParticles() {
        return this.particles.length;
    }
    /** Kill all particles attached to the particle system */
    killAll() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            this.killParticle(particle);
        }
    }
    /**
     * Update all particles attached to the particle system
     * @param time - a time class for managing the passage of time from frame to frame within an odie scene.
     */
    update(time) {
        if (this._isPaused)
            return;
        for (let i = 0; i < this.particles.length; i++) {
            const element = this.particles[i];
            element.update(time);
            if (element.isDead) {
                this.killParticle(element);
            }
        }
    }
    /**
     * Create a group of particles
     * * if `total` particles to be created plus `this.totalParticles` exceded `this.maxParticles`, no particles will be created
     * @param x - origin position of the particle on the x axis
     * @param y - origin position of the particle on the y axis
     * @param total - total amount of particles to be created
     * @param customData - data to be passed to the particles
     */
    create(x, y, total = 10, customData = {}) {
        if (!customData)
            return;
        for (let i = 0; i < total; i++) {
            if (this.particles.length > this.maxParticles) {
                break;
            }
            let particle = null;
            const pooled = this._pool[0];
            if (pooled) {
                particle = pooled;
                this._pool.splice(0, 1);
            }
            else {
                particle = new Particle();
            }
            particle.x = x !== null && x !== void 0 ? x : 0;
            particle.y = y !== null && y !== void 0 ? y : 0;
            particle.create(customData);
            if (customData.behaviour === 'radial') {
                attachRadialBehaviour(particle, i, total, customData.behaviourOptions);
            }
            particle.addTo(this.view);
            this.particles.push(particle);
        }
    }
    /**
     * Remove single particle from array and parent
     * @param particle - the particle to be removed
     */
    killParticle(particle) {
        particle.removeFromParent();
        this._pool.push(particle);
        const index = this.particles.indexOf(particle);
        this.particles.splice(index, 1);
    }
    set pause(value) {
        this._isPaused = value;
    }
    get pause() {
        return this._isPaused;
    }
}
