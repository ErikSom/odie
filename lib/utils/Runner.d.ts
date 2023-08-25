export declare type RunnerItem<T extends string> = Record<T, (...params: unknown[]) => void> & {
    [x: string]: any;
};
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
export declare class Runner<T extends string = any> {
    private static _hash;
    items: RunnerItem<T>[];
    running: boolean;
    /** calls function on all items in the runner */
    dispatch: (...params: unknown[]) => void;
    /** alias for dispatch */
    emit: (...params: unknown[]) => void;
    /** alias for dispatch */
    run: (...params: unknown[]) => void;
    protected needsTidy: boolean;
    /** name of the function to be called */
    private readonly _name;
    private readonly _dummy;
    private _toRemove;
    /**
     * @param name - the function name that will be executed on the listeners added to this MiniRunner.
     * @param argsLength - total number of arguments that will be passed from the runner
     */
    constructor(name: T, argsLength?: number);
    private static _generateRun;
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
    add(item: RunnerItem<T>): this;
    /**
     * Remove a single listener from the dispatch queue.
     * @param item - The listener that you would like to remove.
     */
    remove(item: RunnerItem<T>): this;
    /**
     * Check to see if the listener is already in the MiniRunner
     * @param item - listener that you would like to check.
     * @returns true if the Runner has the object
     */
    contains(item: RunnerItem<T>): boolean;
    /** Removes all listeners from the Runner */
    removeAll(): void;
    /** Remove all references, don't use after this. */
    destroy(): void;
    protected tidy(): void;
    /** true if the Runner is empty */
    get empty(): boolean;
}
//# sourceMappingURL=Runner.d.ts.map