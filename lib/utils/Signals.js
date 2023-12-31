import { Signal } from 'typed-signals';
export class Signals {
    constructor() {
        this.signals = {};
    }
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
    register(...args) {
        // loop through the arguments property and add all children
        for (let i = 0; i < args.length; i++) {
            const signalName = args[i];
            if (!this.signals[signalName]) {
                this.signals[signalName] = new Signal();
            }
        }
    }
    /**
     * Because everything should be pooled - its good to have a way to reset all signals
     */
    resetSignals() {
        for (const i in this.signals) {
            this.signals[i].disconnectAll();
        }
    }
}
