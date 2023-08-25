import type { SignalHash, Time } from '../utils';
import type { Entity } from './Entity';
import type { Scene } from './Scene';
export interface ComponentInterface<DATA = Record<string, any>, ENTITY extends Entity = Entity, SCENE extends Scene = Scene> {
    name?: string;
    data?: DATA;
    signals?: SignalHash;
    entity?: ENTITY;
    addedToEntity?: (entity: ENTITY) => void;
    removedFromEntity?: (entity: ENTITY) => void;
    init?: (data: DATA) => void;
    addedToScene?: (scene: SCENE) => void;
    start?: (dt: number) => void;
    update?: (time: Time) => void;
    render?: (dt: Time) => void;
    removedFromScene?: (scene: SCENE) => void;
    activate?: () => void;
    deactivate?: () => void;
    reset?: () => void;
    extractData?: () => DATA;
}
export interface ComponentConstructor<DATA, ENTITY extends Entity, SCENE extends Scene, COMPONENT extends ComponentInterface<DATA, ENTITY, SCENE>> {
    DEFAULT_NAME?: string;
    new (entity?: ENTITY, data?: DATA): COMPONENT;
}
//# sourceMappingURL=ComponentInterface.d.ts.map