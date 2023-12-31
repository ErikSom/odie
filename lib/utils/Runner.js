/**
 * A Runner is a highly performant and simple alternative to signals. Best used in situations
 * where events are dispatched to many objects at high frequency (say every frame!)
 *
 * like a signal..
 *
 * ```
 * var myObject = {
 *     loaded : new Runner('loaded')
 * }
 *
 * var listener = {
 *     loaded : function(){
 *         // thing
 *     }
 * }
 *
 * myObject.update.add(listener);
 *
 * myObject.loaded.emit();
 * ```
 *
 * Or for handling calling the same function on many items
 * ```
 * var myGame = {
 *     update : new Runner('update', 1)
 * }
 *
 * var gameObject = {
 *     update : function(time){
 *         // update my gamey state
 *     }
 * }
 *
 * myGame.update.add(gameObject1);
 *
 * myGame.update.emit(time);
 * ```
 */
export class Runner {
    /**
     * @param name - the function name that will be executed on the listeners added to this MiniRunner.
     * @param argsLength - total number of arguments that will be passed from the runner
     */
    constructor(name, argsLength = 0) {
        this.items = [];
        this._name = name;
        this.running = false;
        this.dispatch = Runner._generateRun(name, argsLength);
        this.run = this.dispatch;
        this.emit = this.dispatch;
        this._dummy = {};
        // eslint-disable-next-line @typescript-eslint/no-empty-function, brace-style
        (this._dummy[name]) = () => { };
    }
    static _generateRun(name, argsLength) {
        const key = `${name}|${argsLength}`;
        let func = Runner._hash[key];
        if (!func) {
            if (argsLength > 0) {
                let args = 'arg0';
                for (let i = 1; i < argsLength; i++) {
                    args += `,arg${i}`;
                }
                const src = `this.running = true;
                            var items = this.items;
                            for(var i=0;i<items.length;i++)
                            { items[i].${name}(${args});}
                            this.running = false;
                            if( this.needsTidy) this.tidy()`;
                // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
                func = new Function(args, src);
            }
            else {
                // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
                func = new Function(`this.running = true;
                                    var items = this.items;
                                    for(var i=0;i<items.length;i++)
                                    { items[i].${name}(); }
                                    this.running = false;
                                    if( this.needsTidy) this.tidy() `);
            }
            Runner._hash[key] = func;
        }
        return func;
    }
    /**
     * Add a listener to the MiniRunner
     *
     * MiniRunners do not need to have scope or functions passed to them.
     * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
     * as the name provided to the MiniRunner when it was created.
     *
     * Eg A listener passed to this MiniRunner will require a 'complete' function.
     *
     * ```
     * var complete = new MiniRunner('complete');
     * ```
     *
     * The scope used will be the object itself.
     *
     * @param item - The object that will be listening.
     */
    add(item) {
        if (item[this._name]) {
            this.remove(item);
            this.items.push(item);
            this._toRemove = [];
            this.needsTidy = false;
        }
        return this;
    }
    /**
     * Remove a single listener from the dispatch queue.
     * @param item - The listener that you would like to remove.
     */
    remove(item) {
        const index = this.items.indexOf(item);
        // if the runner is running and we remove a listener there can be weird side-effects can happen..
        // this way we remove after we have finished iterating
        if (this.running) {
            this.needsTidy = true;
            // wait..
            this._toRemove.push(index);
            // replace with a dummy for now
            this.items[index] = this._dummy;
        }
        else if (index !== -1) {
            this.items.splice(index, 1);
        }
        return this;
    }
    /**
     * Check to see if the listener is already in the MiniRunner
     * @param item - listener that you would like to check.
     * @returns true if the Runner has the object
     */
    contains(item) {
        return this.items.indexOf(item) !== -1;
    }
    /** Removes all listeners from the Runner */
    removeAll() {
        this.items.length = 0;
    }
    /** Remove all references, don't use after this. */
    destroy() {
        this.removeAll();
        this.items = null;
    }
    tidy() {
        for (let i = this._toRemove.length - 1; i >= 0; i--) {
            const index = this._toRemove[i];
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        }
    }
    /** true if the Runner is empty */
    get empty() {
        return this.items.length === 0;
    }
}
Runner._hash = {};
