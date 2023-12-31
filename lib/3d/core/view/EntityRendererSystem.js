import { calculateTangents } from '../..';
import { FogSystem } from '.';
import { fastNormalFromMatrix } from './utils/fastNormalFromMatrix';
export class EntityRendererSystem {
    constructor(_entity, opts) {
        this._view3dSystem = opts.view3d;
        this._lastMaterial = null;
        // add some extensions extension... used for normals!
        opts.view3d.renderer.context['gl'].getExtension('OES_standard_derivatives');
    }
    flush() {
        this._lastMaterial = null;
    }
    /**
     * renders and draws an entity to the screen
     *
     * @param entity - the entity to render
     * @param renderSession - the current render session
     */
    renderEntity(entity, renderSession) {
        const view3dSystem = this._view3dSystem;
        const view3d = entity.view3d;
        // TODO create a OdieGeometry and Material class that extends pixis shader and geometry
        const geometry = view3d['_geometry'];
        const material = view3d['_material'];
        const renderer = view3dSystem.renderer;
        const baseGeometry = geometry.castToBaseGeometry();
        const uniforms = material.uniforms;
        if (this._lastMaterial !== material) {
            if (material.tangents && !baseGeometry.getAttribute('aTangent')) {
                calculateTangents(baseGeometry);
            }
            uniforms.globals3d = view3dSystem.globalUniforms;
            const lightSig = view3dSystem.lights.lightSig;
            if (material.needsUpdate || material.lightSig !== lightSig) {
                material.needsUpdate = false;
                if (material.build) {
                    const data = { sig: lightSig, lights: renderSession.lights };
                    material.build(data, !!this.scene.getSystem(FogSystem), renderer.context.webGLVersion === 2);
                }
                material.lightSig = lightSig;
            }
            // update uv frame if required..
            const texture = uniforms.uDiffuseMap || uniforms.uNormalMap;
            if (uniforms.uMapFrame && texture) {
                const bt = texture.baseTexture;
                const tFrame = texture.frame;
                const mapFrame = uniforms.uMapFrame;
                mapFrame.x = tFrame.x / bt.width;
                mapFrame.y = tFrame.y / bt.height;
                mapFrame.width = (tFrame.width / bt.width);
                mapFrame.height = (tFrame.height / bt.height);
            }
            renderer.shader.bind(material, null);
            this._lastMaterial = material;
        }
        const contextId = renderer.CONTEXT_UID;
        const uniformData = material.program.glPrograms[contextId].uniformData;
        if (uniformData.uModelMatrix) {
            const modelLocation = uniformData.uModelMatrix.location;
            renderer.gl.uniformMatrix4fv(modelLocation, false, entity.transform.worldTransform.elements);
        }
        if (uniformData.uNormalMatrix) {
            // lets only update them if the transform changed
            if (entity.transform.worldID !== view3d.transformDirty) {
                view3d.transformDirty = entity.transform.worldID;
                fastNormalFromMatrix(view3d._cachedNormal, entity.transform.worldTransform);
            }
            const normalLocation = uniformData.uNormalMatrix.location;
            renderer.gl.uniformMatrix3fv(normalLocation, false, view3d._cachedNormal.elements);
            uniforms.uNormalMatrix = view3d._cachedNormal;
        }
        // TODO going to refactor this once we start the migration to typescript
        // binding it here means we can have one materials for multiple skinned objects!
        if (entity.skinned) {
            if (uniformData.uBoneMatrices) {
                const uBoneMatricesLocation = uniformData.uBoneMatrices.location;
                renderer.gl.uniformMatrix4fv(uBoneMatricesLocation, false, entity.skinned.bones);
            }
            else if (uniformData.uBoneTexture) {
                const boneTexture = entity.skinned.boneTexture;
                const location = renderer.texture.boundTextures.length - 1;
                renderer.gl.uniform1i(uniformData.uBoneTexture.location, location);
                renderer.texture.bind(boneTexture, location);
                const uBoneTextureSizeLocation = uniformData.uBoneTextureSize.location;
                renderer.gl.uniform1f(uBoneTextureSizeLocation, boneTexture.frame.width);
            }
        }
        renderer.state.set(view3d.state);
        renderer.geometry.bind(baseGeometry);
        renderer.geometry.draw(view3d.draw, geometry.size, geometry.start, geometry.instanceCount);
    }
}
EntityRendererSystem.DEFAULT_NAME = 'EntityRenderer';
