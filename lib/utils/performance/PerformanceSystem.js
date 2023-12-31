import { Signal } from 'typed-signals';
export class PerformanceSystem {
    constructor() {
        this.signals = {
            onPerformanceSlow: new Signal(),
        };
        this._sampleSize = this._sampleSize || 5;
        this._lastFPS = new Float32Array(10);
        this._lastFPS.fill(60);
        this._pointer = 0;
        this._lastTime = 0;
        this.averageFPS = 60;
        this._stateArray = [];
    }
    addBreak(fps, stateData) {
        this._stateArray.push(fps);
        this._stateArray.sort((a, b) => b - a);
        this._states.add(fps, stateData);
    }
    start() {
        this.fps = 60;
    }
    render() {
        const time = performance.now();
        const elapsed = time - this._lastTime;
        const fps = (1 / elapsed) * 1000;
        const lastFPS = this._lastFPS;
        const index = this._pointer++ % lastFPS.length;
        lastFPS[index] = fps;
        this._lastTime = time;
        if (!index) {
            // only update datadog every 10 seconds..
            let total = 0;
            for (let i = 0; i < lastFPS.length; i++) {
                total += lastFPS[i];
            }
            this.averageFPS = Math.ceil(total / lastFPS.length);
        }
    }
}
PerformanceSystem.DEFAULT_NAME = 'performance';
