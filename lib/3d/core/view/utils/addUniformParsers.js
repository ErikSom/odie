import { uniformParsers } from 'pixi.js';
import { Plane } from '../../../../math/shapes/Plane';
let inited = false;
/** The first test it passes is the value its treated as, so try to prioritise tests where needed
 ** This includes pixi's pre-existing uniform parse tests
 */
export function addUniformParsers() {
    if (inited)
        return;
    inited = true;
    // Since the plane shares the same properties as some other classes being tested,
    // it needs to be checked first so it can be registered as a plane and not a Vector4, for example
    uniformParsers.unshift({
        test: (data, uniform) => (data.type === 'vec4' && uniform instanceof Plane),
        code: (name) => `
            v = uv.${name};

            gl.uniform4f(ud.${name}.location, v.normal.x, v.normal.y, v.normal.z, v.constant);
        `,
    });
    uniformParsers.push({
        test: (_data, uniform) => (uniform.elements && uniform.elements.length === 16),
        code: (name) => `
        gl.uniformMatrix4fv(ud.${name}.location, false, uv.${name}.elements);
        `,
        // @ts-ignore - Unreleased version of pixi
        codeUbo: (name) => `
            var ${name}_matrix = uv.${name}.elements;

            for(var i = 0; i < 16; i++)
            {
                data[offset + i] = ${name}_matrix[i];
            }
    `,
    });
    uniformParsers.push({
        test: (_data, uniform) => (uniform.elements && uniform.elements.length === 9),
        code: (name) => `
        gl.uniformMatrix3fv(ud.${name}.location, false, uv.${name}.elements);
        `,
    });
    uniformParsers.push({
        test: (data, uniform) => (data.type === 'vec3' && data.size === 1 && uniform.x !== undefined),
        code: (name) => `
        cv = ud.${name}.value;
        v = uv.${name};

        if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.z)
        {
            cv[0] = v.x;
            cv[1] = v.y;
            cv[2] = v.z;
            gl.uniform3f(ud.${name}.location, v.x, v.y, v.z);
        }
        `,
    });
    uniformParsers.push({
        test: (data, uniform) => (data.type === 'vec3' && uniform.r !== undefined && uniform.g !== undefined && uniform.b !== undefined),
        code: (name) => `
        cv = ud.${name}.value;
        v = uv.${name};

        if(cv[0] !== v.r || cv[1] !== v.g || cv[2] !== v.b)
        {
            cv[0] = v.r;
            cv[1] = v.g;
            cv[2] = v.b;
            gl.uniform3f(ud.${name}.location, v.r, v.g, v.b);
        }
        `,
    });
}
