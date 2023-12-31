import { GUI } from 'dat.gui';
let gui = null;
// @ts-ignore
GUI.prototype.removeFolder = function removeFolder(name) {
    const folder = this.__folders[name];
    if (!folder) {
        return;
    }
    folder.close();
    // @ts-ignore
    // eslint-disable-next-line
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    // @ts-ignore
    // eslint-disable-next-line
    this.onResize();
};
export function getGUI(options = {}) {
    if (!gui) {
        gui = new GUI(options);
    }
    return gui;
}
