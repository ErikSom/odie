import type { SignalHash } from './helpers';
export declare class Signals {
    signals: SignalHash;
    constructor();
    /**
     * Add some signals to the item. This exists as we are lazy devs..
     * Instead of:
     *
     * var Signal = require('Signals')
     * signals.onSomething = new Signal();
     * signals.onSomethingElse = new Signal();
     *
     * we can now simply do this:
     * this.registerSignals('onSomething', 'onSomethingElse')
     *
     * @param signalName - the name of the signal to to create.
     */
    register(...args: string[]): void;
    /**
     * Because everything should be pooled - its good to have a way to reset all signals
     */
    resetSignals(): void;
}
//# sourceMappingURL=Signals.d.ts.map