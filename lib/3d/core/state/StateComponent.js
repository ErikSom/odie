import { NOOP } from '../../../utils/helpers/Functions';
export class StateComponent {
    constructor(entity) {
        this.entity = entity;
        this._states = {};
        this._currentStateId = 'empty';
        this._transitionMap = {};
        this.add('empty', { end: NOOP, begin: NOOP, update: NOOP, render: NOOP });
    }
    get id() {
        return this._currentStateId;
    }
    addTransition(id1, id2, bothways) {
        this._transitionMap[id1][id2] = true;
        if (bothways) {
            this._transitionMap[id2][id1] = true;
        }
        return this;
    }
    /**
     * Checks if a state exists on this component
     *
     * @param id - the id of the state you wish to check
     * @returns true if the state exists
     */
    has(id) {
        return !!this._states[id];
    }
    add(id, state) {
        this._states[id] = state;
        state.entity = this.entity;
        if (!state.empty)
            state.empty = NOOP;
        if (!state.begin)
            state.begin = NOOP;
        if (!state.update)
            state.update = NOOP;
        if (!state.render)
            state.render = NOOP;
        if (!state.end)
            state.end = NOOP;
        this._transitionMap[id] = {};
        this.addTransition('empty', id, true);
        return this;
    }
    set(id, force) {
        if (force || this._transitionMap[this._currentStateId][id]) {
            this._states[this._currentStateId].end();
            this._currentStateId = id;
            this._states[this._currentStateId].begin();
        }
    }
    update(time) {
        this._states[this._currentStateId].update(time);
    }
    render(time) {
        this._states[this._currentStateId].render(time);
    }
}
StateComponent.DEFAULT_NAME = 'state';
