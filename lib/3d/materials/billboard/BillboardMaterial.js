import { Program, Rectangle, Shader } from 'pixi.js';
import { Vector3 } from '../../../math';
import frag from './billboard.frag';
import vert from './billboard.vert';
/**
 * a material for rendering billboards - planes that basically face the camera the whole time!
 * does as bit of maths on the shader to unproject a plane
 */
export class BillboardMaterial extends Shader {
    /**
     *
     * @param uMap - the texture you want the billboard to have this can be from sprite sheet (what whaaat?)
     * @param opacity - the transparency of the material, like pixi's alpha!
     */
    constructor(uMap, opacity = 1) {
        const uniforms = {
            uMap,
            uOpacity: opacity,
            uMapFrame: new Rectangle(),
            uScale: new Vector3(1, 1, 1),
        };
        super(Program.from(vert, frag), uniforms);
    }
    get uniforms() {
        return this.uniformGroup.uniforms;
    }
    /**
     * set the texture of the billboard
     */
    set texture(texture) {
        this.uniforms.uMap = texture;
    }
    /**
     * gets the texture of a billboard
     */
    get texture() {
        return this.uniforms.uMap;
    }
    /**
     * set the opacity of the billboard
     */
    set opacity(value) {
        this.uniforms.uOpacity = value;
    }
    /**
     * gets the opacity of a billboard
     */
    get opacity() {
        return this.uniforms.uOpacity;
    }
}
