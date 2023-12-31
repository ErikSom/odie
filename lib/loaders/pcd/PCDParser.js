/* eslint-disable func-names */
/* eslint-disable radix */
/**
 * Description: A Odie loader for PCD ascii and binary files.
 * Ported from Three.js
 *
 * Limitations: Compressed binary files are not supported.
 *
 */
import { Geometry3D } from '../../3d';
/**
 * takes a buffer and reads it as a PCD format
 * it will return a PIXI.Geometry
 *
 * @param data - the loaded data
 */
export function PCDParser(data) {
    const littleEndian = true;
    function parseHeader(data) {
        const PCDheader = {};
        const result1 = data.search(/[\r\n]DATA\s(\S*)\s/i);
        const result2 = (/[\r\n]DATA\s(\S*)\s/i).exec(data.substr(result1 - 1));
        PCDheader.data = result2[1];
        PCDheader.headerLen = result2[0].length + result1;
        PCDheader.str = data.substr(0, PCDheader.headerLen);
        // remove comments
        PCDheader.str = PCDheader.str.replace(/\#.*/gi, '');
        // parse
        PCDheader.version = (/VERSION (.*)/i).exec(PCDheader.str);
        PCDheader.fields = (/FIELDS (.*)/i).exec(PCDheader.str);
        PCDheader.size = (/SIZE (.*)/i).exec(PCDheader.str);
        PCDheader.type = (/TYPE (.*)/i).exec(PCDheader.str);
        PCDheader.count = (/COUNT (.*)/i).exec(PCDheader.str);
        PCDheader.width = (/WIDTH (.*)/i).exec(PCDheader.str);
        PCDheader.height = (/HEIGHT (.*)/i).exec(PCDheader.str);
        PCDheader.viewpoint = (/VIEWPOINT (.*)/i).exec(PCDheader.str);
        PCDheader.points = (/POINTS (.*)/i).exec(PCDheader.str);
        // evaluate
        if (PCDheader.version !== null) {
            PCDheader.version = parseFloat(PCDheader.version[1]);
        }
        if (PCDheader.fields !== null) {
            PCDheader.fields = PCDheader.fields[1].split(' ');
        }
        if (PCDheader.type !== null) {
            PCDheader.type = PCDheader.type[1].split(' ');
        }
        if (PCDheader.width !== null) {
            PCDheader.width = parseInt(PCDheader.width[1]);
        }
        if (PCDheader.height !== null) {
            PCDheader.height = parseInt(PCDheader.height[1]);
        }
        if (PCDheader.viewpoint !== null) {
            PCDheader.viewpoint = PCDheader.viewpoint[1];
        }
        if (PCDheader.points !== null) {
            PCDheader.points = parseInt(PCDheader.points[1], 10);
        }
        if (PCDheader.points === null) {
            PCDheader.points = PCDheader.width * PCDheader.height;
        }
        if (PCDheader.size !== null) {
            PCDheader.size = PCDheader.size[1].split(' ').map(function (x) {
                return parseInt(x, 10);
            });
        }
        if (PCDheader.count !== null) {
            PCDheader.count = PCDheader.count[1].split(' ').map(function (x) {
                return parseInt(x, 10);
            });
        }
        else {
            PCDheader.count = [];
            for (let i = 0, l = PCDheader.fields.length; i < l; i++) {
                PCDheader.count.push(1);
            }
        }
        PCDheader.offset = {};
        let sizeSum = 0;
        for (let i = 0, l = PCDheader.fields.length; i < l; i++) {
            if (PCDheader.data === 'ascii') {
                PCDheader.offset[PCDheader.fields[i]] = i;
            }
            else {
                PCDheader.offset[PCDheader.fields[i]] = sizeSum;
                sizeSum += PCDheader.size[i];
            }
        }
        // for binary only
        PCDheader.rowSize = sizeSum;
        return PCDheader;
    }
    const textData = decodeText(new Uint8Array(data));
    // parse header (always ascii format)
    const PCDheader = parseHeader(textData);
    // parse data
    const position = [];
    const normal = [];
    const color = [];
    // ascii
    if (PCDheader.data === 'ascii') {
        const offset = PCDheader.offset;
        const pcdData = textData.substr(PCDheader.headerLen);
        const lines = pcdData.split('\n');
        for (let i = 0, l = lines.length; i < l; i++) {
            if (lines[i] === '')
                continue;
            const line = lines[i].split(' ');
            if (offset.x !== undefined) {
                position.push(parseFloat(line[offset.x]));
                position.push(parseFloat(line[offset.y]));
                position.push(parseFloat(line[offset.z]));
            }
            if (offset.rgb !== undefined) {
                const rgb = parseFloat(line[offset.rgb]);
                const r = (rgb >> 16) & 0x0000ff;
                const g = (rgb >> 8) & 0x0000ff;
                const b = (rgb >> 0) & 0x0000ff;
                color.push(r / 255, g / 255, b / 255);
            }
            if (offset.normal_x !== undefined) {
                normal.push(parseFloat(line[offset.normal_x]));
                normal.push(parseFloat(line[offset.normal_y]));
                normal.push(parseFloat(line[offset.normal_z]));
            }
        }
    }
    // binary
    if (PCDheader.data === 'binary_compressed') {
        console.error('THREE.PCDLoader: binary_compressed files are not supported');
        return null;
    }
    if (PCDheader.data === 'binary') {
        const dataview = new DataView(data, PCDheader.headerLen);
        const offset = PCDheader.offset;
        for (let i = 0, row = 0; i < PCDheader.points; i++, row += PCDheader.rowSize) {
            if (offset.x !== undefined) {
                position.push(dataview.getFloat32(row + offset.x, littleEndian));
                position.push(dataview.getFloat32(row + offset.y, littleEndian));
                position.push(dataview.getFloat32(row + offset.z, littleEndian));
            }
            if (offset.rgb !== undefined) {
                color.push(dataview.getUint8(row + offset.rgb + 2) / 255.0);
                color.push(dataview.getUint8(row + offset.rgb + 1) / 255.0);
                color.push(dataview.getUint8(row + offset.rgb + 0) / 255.0);
            }
            if (offset.normal_x !== undefined) {
                normal.push(dataview.getFloat32(row + offset.normal_x, littleEndian));
                normal.push(dataview.getFloat32(row + offset.normal_y, littleEndian));
                normal.push(dataview.getFloat32(row + offset.normal_z, littleEndian));
            }
        }
    }
    // build geometry
    const geometry = new Geometry3D();
    if (position.length > 0)
        geometry.addAttribute('position', position);
    if (normal.length > 0)
        geometry.addAttribute('normal', normal);
    if (color.length > 0)
        geometry.addAttribute('color', color);
    return geometry;
}
function decodeText(array) {
    if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder().decode(array);
    }
    // Avoid the String.fromCharCode.apply(null, array) shortcut, which
    // throws a "maximum call stack size exceeded" error for large arrays.
    let s = '';
    for (let i = 0, il = array.length; i < il; i++) {
        // Implicitly assumes little-endian.
        s += String.fromCharCode(array[i]);
    }
    // Merges multi-byte utf-8 characters.
    return decodeURIComponent(escape(s));
}
