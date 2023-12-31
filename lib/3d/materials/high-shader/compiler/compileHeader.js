const findExtensionsRegex = /\s*?\#extension(.|)*?\n/g;
/**
 * generates a header for our shader by combining all the headers in the high fragments
 * returns the vertex and fragment sources to add to the shader.
 * @param highFragments - the highFragments to extract generate a header from
 * @param isWebGL2 - if true output will prefer vertex2 or fragment2 falling back to vertex of fragment if they are not there
 *
 */
export function compileHeader(highFragments, isWebGL2) {
    var _a, _b, _c, _d;
    // process the vertex
    let vertex = highFragments.filter((f) => { var _a; return (_a = f.vertex) === null || _a === void 0 ? void 0 : _a.header; })
        .map((fragment) => (isWebGL2 && fragment.vertex2 ? fragment.vertex2.header : fragment.vertex.header))
        .join('\n');
    const vertexExtensions = (_b = (_a = vertex.match(findExtensionsRegex)) === null || _a === void 0 ? void 0 : _a.join('\n')) !== null && _b !== void 0 ? _b : '';
    vertex = vertex.replace(findExtensionsRegex, '');
    // process the fragments..
    let fragment = highFragments.filter((f) => { var _a; return (_a = f.fragment) === null || _a === void 0 ? void 0 : _a.header; })
        .map((fragment) => (isWebGL2 && fragment.fragment2 ? fragment.fragment2.header : fragment.fragment.header))
        .join('\n');
    const fragmentExtensions = (_d = (_c = fragment.match(findExtensionsRegex)) === null || _c === void 0 ? void 0 : _c.join('\n')) !== null && _d !== void 0 ? _d : '';
    fragment = fragment.replace(findExtensionsRegex, '');
    return {
        vertex: {
            variables: vertex,
            extensions: vertexExtensions,
        },
        fragment: {
            variables: fragment,
            extensions: fragmentExtensions,
        },
    };
}
