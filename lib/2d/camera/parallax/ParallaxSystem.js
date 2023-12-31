import { Container } from 'pixi.js';
export class ParallaxSystem {
    constructor(_entity, opts) {
        this._opts = opts;
        this._layers = {};
        this._parallaxContainer = new Container();
        this._opts.container.addChildAt(this._parallaxContainer, 0);
        this.size = { w: 1000, h: 1000 };
        this.currentZoom = 1;
    }
    addImageLayer(layerName, image, depth = 1, scale = 1) {
        if (!this._layers[layerName]) {
            this._layers[layerName] = {
                depth,
                scale,
                images: [],
            };
        }
        this._layers[layerName].images.push(image);
        image.anchor.set(0.5);
        image.tileScale.x = scale * this.currentZoom;
        image.tileScale.y = scale * this.currentZoom;
        this._parallaxContainer.addChild(image);
    }
    updateBounds(w, h) {
        this.size.w = w;
        this.size.h = h;
    }
    update(time) {
        const dt = time.frameTime;
        this._parallaxContainer.x = this.offset.x;
        this._parallaxContainer.y = this.offset.y;
        this._parallaxContainer.scale.x = this._lerp(this.currentZoom, this._parallaxContainer.scale.x, 0.8);
        this._parallaxContainer.scale.y = this._lerp(this.currentZoom, this._parallaxContainer.scale.y, 0.8);
        for (const key in this._layers) {
            const element = this._layers[key];
            for (let index = 0; index < element.images.length; index++) {
                const image = element.images[index];
                image.tilePosition.x += dt * element.depth * this.velocity.x;
                image.tilePosition.y += dt * element.depth * this.velocity.y;
            }
        }
    }
    reset() {
        this._parallaxContainer.removeChildren();
        this._layers = {};
    }
    setScale(zoom) {
        this.currentZoom = zoom;
    }
    setParallaxAnchor(anchor) {
        this.currentAnchor.x = anchor.x;
        this.currentAnchor.y = anchor.y;
    }
    setVelocity(x = 0, y = 0) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
    setOffset(x = 0, y = 0) {
        this.offset.x = x;
        this.offset.y = y;
    }
    _lerp(v0, v1, t) {
        return (v0 * (1 - t)) + (v1 * t);
    }
}
ParallaxSystem.DEFAULT_NAME = 'parallax';
