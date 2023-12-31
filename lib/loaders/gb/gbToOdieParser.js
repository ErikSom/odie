import { Buffer } from 'pixi.js';
import { Animation3D, Animator3DComponent, SkeletonEntity, SkinnedComponent, } from '../../3d/animation';
import { BoneEntity } from '../../3d/animation/BoneEntity';
import { CameraEntity } from '../../3d/camera/CameraEntity';
import { Entity3D } from '../../3d/core/Entity3D';
import { Geometry3D } from '../../3d/geometry/Geometry3D';
import { GeometryFragment } from '../../3d/geometry/GeometryFragment';
import { LightEntity } from '../../3d/lighting/lights/LightEntity';
import { PhongMaterial } from '../../3d/materials/phong/PhongMaterial';
import { Box3, Matrix4, Sphere, Vector3 } from '../../math';
import { SceneUtilsComponent } from '../utils';
const tempMatrix = new Matrix4();
export class SceneLibrary {
    constructor(gbObject) {
        this.gbObject = gbObject;
        if (!gbObject.materials) {
            gbObject.materials = [];
        }
        this.geometryHash = {};
        if (gbObject.geometryBatch) {
            this.geometryBatch = gbObject.geometryBatch.map((gbPrim) => this._processPrimitive(gbPrim));
        }
        this.materials = {};
        // only need one set of geometries..
        this.geometries = gbObject.geometry.map((gbGeom) => {
            const nameBase = gbGeom.name;
            const weights = gbGeom.weights;
            return gbGeom.primitives.map((gbPrim, index) => {
                let geometry;
                if (gbPrim.attributes) {
                    geometry = this._processPrimitive(gbPrim);
                }
                else {
                    geometry = this._processFragPrimitive(gbPrim);
                }
                // add the geometry to a hash for easy access!
                this.geometryHash[`${nameBase} + ${(index ? index : '')}`] = geometry;
                geometry.castToBaseGeometry().weights = weights;
                return geometry;
            });
        });
    }
    /**
     * A way to pull out a geometry from the scenes cache based on the name of the geometry
     *
     * @param id - the id of the geometry that you would like returned
     * @returns the geometry instance
     */
    getGeometry(id) {
        const geometry = this.geometryHash[id];
        if (!geometry) {
            throw new Error(`Error gb object Geometry ${id} not found!`);
        }
        return geometry;
    }
    /**
     * This will create an instance of a scene. A scene will have an animationController
     * automatically attached to it is animation is present.
     * We also attach a utils component that lets you search and find elements in the scene. (see 'SceneUtils')
     * @param data - the scene options to customize the scene as its generated
     */
    getScene(data = {}) {
        const gbObject = this.gbObject;
        const geometries = this.geometries;
        const materials = data.materials || {};
        const mask = data.mask || [];
        if (!materials.default) {
            materials.default = new PhongMaterial();
        }
        const entities = gbObject.nodes.map((gbNode) => {
            var _a;
            let entity;
            const type = (mask.indexOf(gbNode.type) !== -1) ? 'masked' : gbNode.type;
            switch (type) {
                case 'bone':
                    entity = new BoneEntity(new Matrix4(gbNode.inverseBindMatrix));
                    break;
                case 'light':
                    // eslint-disable-next-line no-case-declarations
                    const lightParams = gbObject.lights[gbNode.light];
                    entity = new LightEntity(lightParams);
                    break;
                case 'camera':
                    // eslint-disable-next-line no-case-declarations
                    const cameraParams = gbObject.cameras[gbNode.camera];
                    entity = new CameraEntity(cameraParams);
                    break;
                case 'model':
                    if (gbNode.skin !== undefined) {
                        // 1. first check for a custom passed material..
                        // 2. then see if we have a named one..
                        // 3. finally use the default
                        const firstGeometry = geometries[gbNode.geometry][0];
                        const material = this._findMaterial(materials, gbNode.name, gbNode.geometry, 0, true);
                        entity = new Entity3D({
                            geometry: firstGeometry,
                            material,
                            layerId: data.layerId || 'default',
                        });
                        if (geometries[gbNode.geometry].length > 1) {
                            for (let i = 1; i < geometries[gbNode.geometry].length; i++) {
                                const material = this._findMaterial(materials, gbNode.name, gbNode.geometry, i, true);
                                const subEntity = new Entity3D({
                                    geometry: geometries[gbNode.geometry][i],
                                    material,
                                    layerId: data.layerId || 'default',
                                });
                                // Set material name to entity's name
                                // If geometry get split by material slots, this will make easier
                                // to find sub entities by their original material name
                                if ((_a = gbObject.materials[i]) === null || _a === void 0 ? void 0 : _a.name) {
                                    subEntity.name = gbObject.materials[i].name;
                                }
                                entity.addChild(subEntity);
                            }
                        }
                    }
                    else {
                        const material = this._findMaterial(materials, gbNode.name, gbNode.geometry, 0, false);
                        entity = new Entity3D({
                            geometry: geometries[gbNode.geometry][0],
                            material,
                            layerId: data.layerId || 'default',
                        });
                        if (geometries[gbNode.geometry].length > 1) {
                            for (let i = 1; i < geometries[gbNode.geometry].length; i++) {
                                const material = this._findMaterial(materials, gbNode.name, gbNode.geometry, i, false);
                                const subEntity = new Entity3D({
                                    geometry: geometries[gbNode.geometry][i],
                                    material,
                                    layerId: data.layerId || 'default',
                                });
                                entity.addChild(subEntity);
                            }
                        }
                    }
                    break;
                default:
                    entity = new Entity3D();
            }
            if (gbNode.transform) {
                tempMatrix.elements = gbNode.transform;
                // fromArray(gbNode.transform, 0);
                entity.transform.applyMatrix(tempMatrix);
            }
            entity.name = gbNode.name;
            return entity;
        });
        let skeletons = null;
        if (gbObject.skins) {
            // create skeletons..
            skeletons = gbObject.skins.map((gbSkin) => {
                const bones = gbSkin.joints.map((index) => entities[index]);
                const skeleton = new SkeletonEntity(bones);
                return skeleton;
            });
        }
        // now bind the skeletons...
        gbObject.nodes.forEach((gbNode, i) => {
            if (gbNode.skin !== undefined) {
                const entity = entities[i];
                entity.skinned = entity.addComponent(SkinnedComponent, { skeleton: skeletons[gbNode.skin] });
            }
        });
        // parent them up..
        gbObject.nodes.forEach((gbNode, i) => {
            const entity = entities[i];
            gbNode.children.forEach((childIndex) => {
                const child = entities[childIndex];
                if (entity === child) {
                    console.warn('oops bone is parented to self..');
                }
                else {
                    entity.addChild(child);
                }
            });
        });
        const scene = new Entity3D();
        if (gbObject.scenes.length > 1) {
            console.warn('only one scene supported at the moment');
        }
        const sceneRaw = gbObject.scenes[0];
        sceneRaw.children.forEach((childIndex) => {
            scene.addChild(entities[childIndex]);
        });
        if (gbObject.animations.length) {
            const animations = gbObject.animations.map((a, i) => {
                a.name = String(i);
                return Animation3D.fromData(a);
            });
            scene.addComponent(Animator3DComponent, {
                animations,
                clips: data.clips,
                mixes: data.mixes,
                fps: data.fps,
            });
            if ((data === null || data === void 0 ? void 0 : data.autoPlay) !== false)
                scene.getComponent(Animator3DComponent).play('0');
        }
        // TODO - consider not naming this utils as its not very descriptive!
        scene.addComponent(SceneUtilsComponent, { map: entities }, 'utils');
        return scene;
    }
    _processFragPrimitive(gbPrim) {
        const frag = new GeometryFragment({
            geometry: this.geometryBatch[gbPrim.geometry],
            start: gbPrim.start,
            size: gbPrim.size,
        });
        const bounds = gbPrim.bounds;
        frag.boundingBox = new Box3(new Vector3(bounds[0], bounds[1], bounds[2]), new Vector3(bounds[3], bounds[4], bounds[5]));
        frag.boundingSphere = frag.boundingBox.getBoundingSphere(new Sphere());
        return frag;
    }
    _processPrimitive(gbPrim) {
        var _a, _b;
        const geometry = new Geometry3D();
        const attributes = gbPrim.attributes;

        if(attributes.colors){
            debugger;
        }

        const bounds = gbPrim.bounds;
        if (bounds) {
            geometry.boundingBox = new Box3(new Vector3(bounds[0], bounds[1], bounds[2]), new Vector3(bounds[3], bounds[4], bounds[5]));
            geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new Sphere());
        }
        
        geometry.addAttribute('aPosition', new Buffer(attributes.positions), 3);
        geometry.addAttribute('aNormal', new Buffer(attributes.normals), 3);
        if (attributes.uvs) {
            geometry.addAttribute('aUv', new Buffer(attributes.uvs), 2);
        }
        else {
            console.warn('[GB Object] no uvs found, generating them to make compatible with standard shader');
            geometry.addAttribute('aUv', new Buffer(new Float32Array((attributes.positions.length / 3) * 2)), 2);
        }
        if ((_a = attributes.weights) === null || _a === void 0 ? void 0 : _a.length) {
            geometry.addAttribute('aBoneWeights', new Buffer(attributes.weights), 4);
            // TODO don't like that im converting here..
            geometry.addAttribute('aBoneIndices', new Buffer(new Float32Array(attributes.boneIndices)), 4);
        }
        if (attributes.tangents) {
            geometry.addAttribute('aTangents', new Buffer(attributes.tangents));
        }
        if (gbPrim.targets) {
            let emptyData;
            for (let i = 0; i < 4; i++) {
                const target = gbPrim.targets[i];
                if (target) {
                    geometry.addAttribute(`aMorphTargetPosition${i + 1}`, new Buffer(target.positions), 3);
                    if (!target.normals) {
                        if (!emptyData) {
                            emptyData = new Float32Array(attributes.positions.length);
                        }
                    }
                    geometry.addAttribute(`aMorphTargetNormal${i + 1}`, new Buffer((_b = target.normals) !== null && _b !== void 0 ? _b : emptyData), 3);
                }
                else {
                    if (!emptyData) {
                        emptyData = new Float32Array(attributes.positions.length);
                    }
                    geometry.addAttribute(`aMorphTargetPosition${i + 1}`, new Buffer(emptyData), 3);
                    geometry.addAttribute(`aMorphTargetNormal${i + 1}`, new Buffer(emptyData), 3);
                }
            }
        }
        if (gbPrim.indices) {
            geometry.addIndex(new Buffer(gbPrim.indices));
        }
        return geometry;
    }
    _findMaterial(materials, name, geometryIndex, primitiveIndex, skinned = false) {
        var _a;
        const gbObject = this.gbObject;
        const primitiveRawData = gbObject.geometry[geometryIndex].primitives[primitiveIndex];
        let material = materials[name];
        if (!material) {
            const materialsIndex = primitiveRawData.material;
            const rawMaterial = (_a = this.gbObject) === null || _a === void 0 ? void 0 : _a.materials[materialsIndex];
            if (materials[rawMaterial === null || rawMaterial === void 0 ? void 0 : rawMaterial.name]) {
                return materials[rawMaterial.name];
            }
            if (materials[rawMaterial.name]) {
                return materials[rawMaterial.name];
            }
            // make a default material
            material = ((skinned && materials.defaultSkinned) ? materials.defaultSkinned : materials.default);
        }
        return material;
    }
}
export function gbToOdieParser(gbObject) {
    const library = new SceneLibrary(gbObject);
    return library;
}
