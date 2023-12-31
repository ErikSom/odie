/* eslint-disable no-constant-condition */
import { BaseTexture, Framebuffer, MIPMAP_MODES, Sprite, State, Texture, TYPES, UniformGroup, WRAP_MODES } from 'pixi.js';
import { Matrix4 } from '../../../math/matrix/Matrix4';
import { Frustum } from '../../../math/misc/Frustum';
import { Box3 } from '../../../math/shapes/Box3';
import { Vector3 } from '../../../math/vector/Vector3';
import { RenderGroupComponent } from '../../lighting/reflector/RenderGroupComponent';
import { ShadowMaterial } from '../../materials/shadows/ShadowMaterial';
let UP;
let ZERO;
let tempVec;
let tempVec2;
let tempMat2;
const sortOpaque = (a, b) => {
    const aView3d = a.view3d;
    const bView3d = b.view3d;
    const aGeom = aView3d['_geometry'];
    const bGeom = bView3d['_geometry'];
    const aBase = aGeom.castToBaseGeometry();
    const bBase = bGeom.castToBaseGeometry();
    // TODO: id does exist on Geomtry, update when pixi 5.3 is released
    // eslint-disable-next-line no-nested-ternary
    return (aView3d.orderBias - bView3d.orderBias)
        // eslint-disable-next-line no-constant-condition, no-nested-ternary
        || (aView3d.shadowMaterial && bView3d.shadowMaterial) ? 0 : aView3d.shadowMaterial ? -1 : 1
        || (a.skinned && b.skinned) ? 0 : a.skinned ? -1 : 1
        || (aView3d.geometry.id - bView3d.geometry.id)
        || (aBase.id - bBase.id);
};
/**
 * http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-16-shadow-mapping/
 *
 * Main responsibility of this class is to render shadow maps based on where the light is
 * We need one of these per shadow caster
 *
 * currently you manually need to create on these to have a shadow
 *
 */
export class ShadowComponent {
    constructor(entity, opts) {
        this._bounds = new Box3();
        if (!UP) {
            UP = new Vector3(0, 1, 0);
            ZERO = new Vector3(0, 0, 0);
            tempVec = new Vector3();
            tempVec2 = new Vector3();
            tempMat2 = new Matrix4();
        }
        this.entity = entity;
        this._shadowRenderGroup = entity.addComponent(RenderGroupComponent);
        // TODO make sure to deal with instancing too!
        this.frequency = 1;
        this._light = opts.light;
        const mapSize = opts.size || 1024;
        const baseTexture = new BaseTexture(null, {
            width: mapSize,
            height: mapSize,
            // this base texture writes HALF FLOATS for more precision whilst writing shadows!
            // half floats supported by most mobiles too!
            type: TYPES.HALF_FLOAT,
            wrapMode: WRAP_MODES.CLAMP,
            mipmap: MIPMAP_MODES.OFF
        });
        this._shadowMap = new Texture(baseTexture);
        // pixi typings need addressing..
        this._shadowFramebuffer = new Framebuffer(mapSize, mapSize)
            .addColorTexture(0, baseTexture)
            .enableDepth();
        this._debugSprite = new Sprite(this._shadowMap);
        this._debugSprite.scale.set(0.25);
        // TODO - only really need one set of these!
        this._shadowMaterial = new ShadowMaterial();
        this._shadowMaterialSkinned = new ShadowMaterial({ skinned: true });
        this._shadowState = new State();
        this._shadowState.depthTest = true;
        this._shadowState.culling = false;
        this._shadowState.blend = false;
        this.bias = (opts.bias === undefined) ? 0.001 : opts.bias;
        this.poissonSpread = (opts.poissonSpread === undefined) ? 2000 : opts.poissonSpread;
        const lightId = this._light.light.lightId;
        const uniforms = {};
        uniforms[`uShadowProjectionView${lightId}`] = new Matrix4();
        uniforms[`uShadowMap${lightId}`] = this._shadowMap;
        uniforms[`uShadowParams${lightId}`] = new Float32Array(2);
        this._shadowUniforms = new UniformGroup(uniforms, false);
        this.refreshRate = 1;
        this._shadowProjectionMatrix = new Matrix4();
    }
    addedToScene(scene) {
        const lightId = this._light.light.lightId;
        const view3DSystem = scene.view3d;
        // set the light uniforms for the shadows..
        view3DSystem.lights.lightUniforms.uniforms[`shadow${lightId}`] = this._shadowUniforms;
        view3DSystem.onPreDrawScene.add(this);
    }
    removedFromScene(scene) {
        scene.view3d.onPreDrawScene.remove(this);
    }
    /**
     * renders all items in the renderList to the shadowMap texture
     */
    preDrawScene() {
        if (this.frequency++ % this.refreshRate)
            return;
        let renderables = this._shadowRenderGroup.toRenderList;
        if (this._shadowRenderGroup.toIgnoreList.length > 0) {
            renderables = renderables.filter((renderable) => (this._shadowRenderGroup.toIgnoreList.indexOf(renderable) === -1));
        }
        // early out if the game is not present..
        if (!this._light.scene || !renderables.length)
            return;
        const view3d = this.entity.scene.view3d;
        const lightId = this._light.light.lightId;
        const renderer = view3d.renderer;
        const flipped = tempVec.copy(this._light.light.direction);
        const lightViewMatrix = tempMat2;
        if (this._light.light.type === 2) {
            const lightPos = this._light.transform.extractPosition(tempVec2);
            flipped.add(lightPos);
            lightViewMatrix.lookAtMove(lightPos, flipped, UP);
        }
        else {
            lightViewMatrix.lookAtMove(ZERO, flipped, UP);
        }
        // get aabb.......
        // TODO culling.. need a cleanr way - will come back to!
        // if (view3d.game.culling)
        // {
        //     // TODO technically happening twice!
        //     // @ts-ignore
        //     renderables = view3d.game.culling.cull(activeEntities, view3d.camera);
        // }
        if (this._light.light.type === 0) {
            const bounds = this._bounds;
            bounds.makeEmpty();
            renderables.forEach((e) => {
                bounds.expandBySphere(e.view3d.getBoundingSphere());
            });
            bounds.applyMatrix4(lightViewMatrix);
            this._shadowProjectionMatrix
                .makeOrthographic(bounds.min.x, bounds.max.x, bounds.min.y, bounds.max.y, 
            // z is treated a bit differently in odie.
            // the bounds we get are actually flipped when creating
            // an orthogonal matrix. so we need to reverse them
            -bounds.max.z, -bounds.min.z);
        }
        else {
            this._shadowProjectionMatrix
                .makePerspective(this._light.light.radius * 2, 1, 0.1, this._light.light.distance);
        }
        const shadowUniforms = this._shadowUniforms.uniforms;
        // TODO remove this matrix upload! we can do it with light position only!
        const shadowProjectionView = shadowUniforms[`uShadowProjectionView${lightId}`];
        shadowUniforms[`uShadowParams${lightId}`][0] = this.bias;
        shadowUniforms[`uShadowParams${lightId}`][1] = this.poissonSpread;
        shadowProjectionView.multiplyMatrices(this._shadowProjectionMatrix, lightViewMatrix);
        if (this._light.light.type === 2) {
            const frustum = new Frustum();
            frustum.setFromMatrix(shadowProjectionView);
            renderables = renderables.filter((entity) => {
                const view3d = entity.view3d;
                return frustum.intersectsSphere(view3d.getBoundingSphere());
            });
        }
        this._shadowUniforms.update();
        // store the current framebuffer.. we re assign it at the end!
        const currentFramebuffer = renderer.framebuffer.current;
        // bind our framebuffer.. and clear it!
        renderer.framebuffer.bind(this._shadowFramebuffer);
        renderer.framebuffer.clear(10000, 0, 0, 1);
        // draw the item to based on the light direction..
        renderer.state.set(this._shadowState);
        // sort items for optimised render!
        // TODO only needs to change if the renderList changes!
        renderables.sort(sortOpaque);
        // next take them and filter them a
        renderables.forEach((e) => {
            if (!e.scene)
                return;
            const view3d = e.view3d;
            const geometry = view3d.geometry;
            let material = null;
            let uniforms = null;
            if (view3d.shadowMaterial) {
                material = e.view3d.shadowMaterial;
                if (e.skinned) {
                    material.uniforms.bones = e.skinned.bones;
                }
            }
            else if (e.skinned) {
                material = this._shadowMaterialSkinned;
                material.uniforms.uBoneMatrices = e.skinned.bones;
            }
            else {
                material = this._shadowMaterial;
            }
            uniforms = material.uniforms;
            uniforms.uModelMatrix = e.transform.worldTransform;
            // TODO this is updated EACH time should be a uniform group!
            uniforms.uShadowProjectionView = shadowProjectionView;
            renderer.shader.bind(material, false);
            const baseGeometry = geometry.castToBaseGeometry();
            renderer.geometry.bind(baseGeometry);
            renderer.geometry.draw(view3d.draw, geometry.size, geometry.start, geometry.instanceCount);
        });
        renderer.framebuffer.bind(currentFramebuffer);
    }
    /**
     * add an entity to the render list. all its children will also be rendered
     * @param entity - entity to add to the render list
     */
    add(entity) {
        this._shadowRenderGroup.add(entity);
    }
    /**
     * add an entity to the ignore list. all its children will also be ignored
     * @param entity - entity to add to the render list
     */
    ignore(entity) {
        this._shadowRenderGroup.ignore(entity);
    }
}
