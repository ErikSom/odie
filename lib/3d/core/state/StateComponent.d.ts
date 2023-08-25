import type { ComponentInterface, Entity } from '../../../core';
import type { Time } from '../../../utils';
export interface StateData {
    entity?: Entity;
    empty?: () => void;
    end?: () => void;
    begin?: () => void;
    update?: (time: Time) => void;
    render?: (time: Time) => void;
}
export declare class StateComponent implements ComponentInterface {
    static DEFAULT_NAME: string;
    readonly entity: Entity;
    private _states;
    private _currentStateId;
    private _transitionMap;
    constructor(entity: Entity);
    get id(): string;
    addTransition(id1: string | number, id2: string | number, bothways: boolean): this;
    /**
     * Checks if a state exists on this component
     *
     * @param id - the id of the state you wish to check
     * @returns true if the state exists
     */
    has(id: string): boolean;
    add(id: string | number, state: StateData): this;
    set(id: string, force: boolean): void;
    update(time: Time): void;
    render(time: Time): void;
}
//# sourceMappingURL=StateComponent.d.ts.map