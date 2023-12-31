import { GroupSystem } from '../../core/groups';
import { Scene } from '../../core/Scene';
import { PoolSystem } from '../../utils/pool/PoolSystem';
import { View2DSystem } from './view/View2DSystem';
export class Scene2D extends Scene {
    constructor(container) {
        super();
        this.register('onGameover');
        this.register('onGameComplete');
        this.pool = this.addSystem(PoolSystem, {});
        this.group = this.addSystem(GroupSystem);
        this.view2d = this.addSystem(View2DSystem, { stage: container });
    }
    addChild(...entities) {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            this.addToScene(entity);
        }
    }
    removeChild(...entities) {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            this.removeFromScene(entity);
        }
    }
}
