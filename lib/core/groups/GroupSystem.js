import { Group } from './Group';
const temp = [];
export class GroupSystem {
    constructor(_entity, opts) {
        this.groups = {};
        if (opts === null || opts === void 0 ? void 0 : opts.groups) {
            this.initGroups(opts.groups);
        }
    }
    entityAddedToScene(entity) {
        // now add them into any other custom groups..
        for (let i = 0; i < entity.groups.length; i++) {
            const id = entity.groups[i];
            let group = this.groups[id];
            if (!group) {
                group = this.groups[id] = new Group();
            }
            group.add(entity);
        }
    }
    entityRemovedFromScene(entity) {
        // now remove them into any other custom groups..
        for (let j = 0; j < entity.groups.length; j++) {
            const id = entity.groups[j];
            this.groups[id].remove(entity);
        }
    }
    initGroups(groupIds) {
        for (let i = 0; i < groupIds.length; i++) {
            const id = groupIds[i];
            let group = this.groups[id];
            if (!group) {
                group = this.groups[id] = new Group();
            }
        }
    }
    // search functions..
    find(name, groupId) {
        const groups = this.groups;
        if (!groupId) {
            const allChildren = this.scene.allEntities.children;
            for (let i = 0; i < allChildren.length; i++) {
                if (allChildren[i].name === name) {
                    return allChildren[i];
                }
            }
        }
        else if (groups[groupId]) {
            const group = groups[groupId].children;
            for (let i = 0; i < group.length; i++) {
                if (group[i].name === name) {
                    return group[i];
                }
            }
        }
        return null;
    }
    findAll(name, groupId) {
        const groups = this.groups;
        if (!groups[groupId])
            return null;
        const group = groups[groupId].children;
        temp.length = 0;
        for (let i = 0; i < group.length; i++) {
            if (group[i].name === name) {
                temp.push(group[i]);
            }
        }
        return temp;
    }
    reset() {
        const groups = this.groups;
        for (const i in groups) {
            groups[i].empty();
        }
    }
    empty() {
        this.reset();
    }
}
GroupSystem.DEFAULT_NAME = 'group';
