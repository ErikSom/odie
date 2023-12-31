/**
 * modify the original behaviour of each particle to move in a radial pattern
 * @param particle - current particle
 * @param particleIndex - the current particle's index
 * @param total - total amount of particles
 * @param options - additional options to modify the radial behaviour
 */
export function attachRadialBehaviour(particle, particleIndex, total, options) {
    var _a, _b, _c;
    const layers = (_a = options === null || options === void 0 ? void 0 : options.layers) !== null && _a !== void 0 ? _a : 1;
    const currentLayer = Math.floor((particleIndex / total) * layers) + 1;
    const angleOffset = (_b = (currentLayer * options.angleOffset)) !== null && _b !== void 0 ? _b : 0;
    const angle = ((particleIndex / (total / layers)) * (Math.PI * 2)) + angleOffset;
    let force = Math.min(particle.data.forceX, particle.data.forceY) - (particle.data.forceX - particle.data.forceY);
    if (force) {
        const lossPerLayer = (options.forceLossPerLayer === 'equal') ? 0.5 : (_c = options.forceLossPerLayer) !== null && _c !== void 0 ? _c : 0.85;
        force *= Math.pow(lossPerLayer, currentLayer - 1);
    }
    particle.velocity.x = Math.cos(angle) * force;
    particle.velocity.y = Math.sin(angle) * force;
}
