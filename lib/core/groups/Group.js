import { Signal } from 'typed-signals';
export class Group {
    constructor(children = []) {
        this.onAdded = new Signal();
        this.onRemoved = new Signal();
        this.children = children;
    }
    add(item) {
        const index = this.children.indexOf(item);
        if (index !== -1)
            return;
        this.children.push(item);
        this.onAdded.emit(item);
    }
    remove(item) {
        const index = this.children.indexOf(item);
        if (index === -1)
            return false;
        this.children.splice(index, 1);
        this.onRemoved.emit(item);
        return true;
    }
    contains(item) {
        return this.children.indexOf(item) !== -1;
    }
    getIndex(item) {
        return this.children.indexOf(item);
    }
    getItem(index) {
        return this.children[index];
    }
    run(f, scope) {
        let i;
        if (scope) {
            for (i = 0; i < this.children.length; i++) {
                f.call(scope, this.children[i]);
            }
        }
        else {
            for (i = 0; i < this.children.length; i++) {
                f(this.children[i]);
            }
        }
    }
    empty() {
        this.children.length = 0;
        this.onAdded.disconnectAll();
        this.onRemoved.disconnectAll();
    }
    get length() {
        return this.children.length;
    }
}
