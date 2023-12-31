export class Component {
    constructor(entity, data) {
        if (!entity) {
            throw new Error('component requires an entity');
        }
        this.entity = entity;
        this.data = data;
        // overridden when component is added
        this.name = '';
        this.scene = null;
        this.active = false;
    }
    static create(name, object) {
        if (Component._mapHash[name])
            return Component._mapHash[name];
        if (!object) {
            console.warn(`make sure to create you ${name}component first!`);
        }
        function com(entity, data) {
            // @ts-ignore
            this.entity = entity;
            // @ts-ignore
            this.data = data;
            // @ts-ignore
            this.id = name;
            if (object.constructor) {
                // @ts-ignore
                object.constructor.call(this);
            }
        }
        com.prototype = Object.create(Component.prototype);
        com.id = name;
        for (const i in object) {
            com.prototype[i] = object[i];
        }
        Component._mapHash[name] = com;
        return com;
    }
}
Component._mapHash = {};
