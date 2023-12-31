import { TransformComponent } from '../3d';
import { Component } from '../core/Component';
import { getGUI } from './debugGUI';
let gui = null;
export class TransformEdit extends Component {
    constructor(entity, data = {}) {
        super(entity, data);
        this.created = false;
    }
    addedToScene() {
        const transform = this.entity.getComponent(TransformComponent);
        gui = getGUI();
        if (!transform || !gui)
            return;
        const folder = gui.addFolder(this.entity.name || 'object');
        const range = this.data.range || 200;
        const scaleRange = this.data.scaleRange || 50;
        transform.position.set(0.001);
        folder.add(transform.position, 'x', -range, range);
        folder.add(transform.position, 'y', -range, range);
        folder.add(transform.position, 'z', -range, range);
        folder.add(transform.scale, 'x', -scaleRange, scaleRange);
        folder.add(transform.scale, 'y', -scaleRange, scaleRange);
        folder.add(transform.scale, 'z', -scaleRange, scaleRange);
        folder.add(transform.rotation, 'x', -Math.PI, Math.PI);
        folder.add(transform.rotation, 'y', -Math.PI, Math.PI);
        folder.add(transform.rotation, 'z', -Math.PI, Math.PI);
    }
    removedFromScene() {
        // @ts-ignore
        gui.removeFolder(this.entity.name || 'object');
    }
}
TransformEdit.DEFAULT_NAME = 'transformEdit';
