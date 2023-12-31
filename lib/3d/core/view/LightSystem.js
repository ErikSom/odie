import { UniformGroup, } from 'pixi.js';
import { AmbientLight, LightComponent } from '../..';
/**
 * used internally to help handle multiple instances of a lightSystem
 */
let UID = 0;
/**
 * light system is responsible for building taking all the lights in the world.
 * As lights are added, it will manage them and automatically update the uniforms required to run them
 *
 * PRO Tip - its best to set your lights once and then not change how many there are in the scene.
 * changing the number of lights / type of lights on the fly invalidates the shaders and could cause a jank moments
 * due to new shaders needing to be recompiled.
 *
 * This really would only become a problem if we needed to make a large open world! For now, its best to add the maximum number of lights to the scene
 * at start up and disable / enable them as required.
 */
export class LightSystem {
    constructor(_entity, options) {
        this._uid = UID++;
        this.lightsDirtyTick = 0;
        this._lightsDirtyTick = -1;
        this.lightEntities = [];
        this.freezeLights = false;
        this.ambientLight = new AmbientLight(0xFFFFFF, 0.5);
        this.lightUniforms = new UniformGroup({
            uGlobalAmbient: this.ambientLight.output,
        }, true);
        options.view3d.globalUniforms.uniforms.lights = this.lightUniforms;
    }
    renderBegin() {
        this.ambientLight.update();
        // lights always moving!
        // TODO if lights don't move... we can not update!
        this.lightUniforms.update();
        const lights = this.lightEntities;
        if (!this.freezeLights && this._lightsDirtyTick !== this.lightsDirtyTick) {
            lights.sort((a, b) => a.light.type - b.light.type || a.UID - b.UID);
            this.lightSig = lights.map((light) => light.light.type).join('-') + this._uid;
            this._lightsDirtyTick = this.lightsDirtyTick;
            const uniforms = this.lightUniforms.uniforms;
            lights.forEach((light) => {
                const lightComponent = light.light;
                const lightId = lightComponent.lightId;
                uniforms[`uLightColor${lightId}`] = lightComponent.output;
                uniforms[`uLightDirection${lightId}`] = lightComponent.direction;
                if (lightComponent.type === 1) {
                    uniforms[`uLightPosition${lightId}`] = lightComponent.position;
                    if (!uniforms[`uLightDistance${lightId}`]) {
                        Object.defineProperty(uniforms, `uLightDistance${lightId}`, {
                            enumerable: true,
                            get() {
                                return lightComponent.distance;
                            },
                        });
                    }
                }
                if (lightComponent.type === 2) {
                    uniforms[`uLightPosition${lightId}`] = lightComponent.position;
                    uniforms[`uLightDistance${lightId}`] = lightComponent.distance;
                    uniforms[`uLimit${lightId}`] = lightComponent.limit;
                }
            });
        }
    }
    start() {
        // TODO move this...don't like it being here..
        this.scene.group.initGroups(['_lights']);
    }
    entityAddedToScene(entity) {
        if (entity.getComponent(LightComponent)) {
            this.lightEntities.push(entity);
            this.lightsDirtyTick++;
        }
    }
    entityRemovedFromScene(entity) {
        if (entity.getComponent(LightComponent)) {
            const index = this.lightEntities.indexOf(entity);
            if (index !== -1) {
                this.lightEntities.splice(index, 1);
                this.lightsDirtyTick++;
            }
        }
    }
    empty() {
        this.lightEntities.length = 0;
    }
}
LightSystem.DEFAULT_NAME = 'lights';
