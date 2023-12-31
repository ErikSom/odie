import { batchGeometry, dedupeGeometry, flattenScene } from '@goodboydigital/gb-model-tools';
import { Animator3DComponent, calculateBounds } from '../../3d';
import { deepCopy } from '../../utils/deepCopy';
import { SceneUtilsComponent } from '../utils';
/**
 * Converts a odie entity 3D into a GBObject! Magic :D
 * Currently does only supports models and non skinned animations
 *
 * TODO
 * [x] models
 * [x] animation
 * [ ] skins
 * [ ] materials
 * [ ] lights
 * [ ] cameras
 *
 * @param entity - the scene to convert to a GBObject
 * @param options - the compression options
 */
export function odieToGbConverter(entity, options = {}) {
    const gbObject = {
        nodes: [],
        animations: [],
        skins: [],
        scenes: [
            {
                name: 'exported-scene',
                children: [],
            },
        ],
    };
    const nodeMap = new Map();
    fillNodeMap(entity, nodeMap);
    processEntity(entity, { gbObject, nodeMap });
    // apply any settings..
    if (options.flatten) {
        flattenScene(gbObject);
    }
    else {
        if (options.dedupe) {
            dedupeGeometry(gbObject);
        }
        if (options.batch) {
            batchGeometry(gbObject);
        }
    }
    return gbObject;
}
const odieToGbMap = {
    position: 'positions',
    normals: 'normals',
    uvs: 'uvs',
    tangents: 'tangents',
};
function fillNodeMap(entity, map) {
    const index = map.size;
    map.set(entity, index);
    entity.container.children.forEach((child) => {
        fillNodeMap(child, map);
    });
}
function processEntity(entity, sessionData) {
    var _a;
    const { gbObject, lastParent } = sessionData;
    const node = {
        name: entity.name,
        transform: entity.transform.localTransform.elements,
        children: [],
    };
    if (lastParent) {
        lastParent.children.push(gbObject.nodes.length);
    }
    else {
        gbObject.scenes[0].children.push(gbObject.nodes.length);
    }
    gbObject.nodes.push(node);
    if (entity.view3d) {
        const geometry = entity.view3d.geometry;
        const primitive = convertGeometryToPrimitive(geometry);
        const gbGeometry = {
            name: entity.name,
            primitives: [primitive],
        };
        gbObject.geometry = (_a = gbObject.geometry) !== null && _a !== void 0 ? _a : [];
        node.geometry = gbObject.geometry.length;
        node.type = 'model';
        gbObject.geometry.push(gbGeometry);
    }
    if (entity.getComponent(Animator3DComponent)) {
        convertAnimation(entity, sessionData);
    }
    entity.container.children.forEach((child) => {
        sessionData.lastParent = node;
        processEntity(child, sessionData);
    });
}
function convertGeometryToPrimitive(geometry) {
    const attributes = {};
    for (const i in geometry.attributes) {
        const attribute = geometry.attributes[i];
        attributes[odieToGbMap[i]]
            = geometry.buffers[attribute.buffer].data;
    }
    if (!geometry.boundingBox) {
        geometry.boundingBox = calculateBounds(geometry);
    }
    const { min, max } = geometry.boundingBox;
    const primitive = {
        attributes,
        bounds: [min.x, min.y, min.z, max.x, max.y, max.z],
        indices: geometry.getIndex().data,
    };
    return primitive;
}
function convertAnimation(entity, session) {
    var _a;
    const { gbObject, nodeMap } = session;
    const animationComponent = entity.getComponent(Animator3DComponent);
    const sceneUtils = entity.getComponent(SceneUtilsComponent);
    const animations = animationComponent['_animations'];
    const entityMap = sceneUtils.getAllEntities();
    for (const i in animations) {
        const animation = animations[i];
        const data = deepCopy(animation.data);
        data.forEach((data) => {
            data.id = nodeMap.get(entityMap[data.id]);
        });
        const gbAnimation = {
            data,
            name: animation.name,
        };
        gbObject.animations = (_a = gbObject.animations) !== null && _a !== void 0 ? _a : [];
        gbObject.animations.push(gbAnimation);
    }
}
