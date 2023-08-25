import { Signal } from 'typed-signals';
import type { StateData } from '../../3d';
import type { SystemInterface } from '../../core/SystemInterface';
export declare class PerformanceSystem implements SystemInterface {
    static DEFAULT_NAME: string;
    readonly signals: {
        onPerformanceSlow: Signal<() => void>;
    };
    averageFPS: number;
    fps: number;
    private _lastTime;
    private readonly _states;
    private readonly _sampleSize;
    private readonly _lastFPS;
    private _pointer;
    private readonly _stateArray;
    constructor();
    addBreak(fps: number, stateData: StateData): void;
    start(): void;
    render(): void;
}
//# sourceMappingURL=PerformanceSystem.d.ts.map