import { Container } from 'pixi.js';
export class View2DComponent {
    constructor(_entity, data = {}) {
        this.data = data;
        this.layer = data.layer || 'default';
        this.view = data.view || new Container();
    }
}
View2DComponent.DEFAULT_NAME = 'view2d';
