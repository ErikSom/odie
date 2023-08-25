import { Entity3D } from '../../core/Entity3D';
import { ShadowComponent } from '../shadows/ShadowComponent';
import type { LightOptions } from './LightComponent';
import { LightComponent } from './LightComponent';
export interface LightEntityOptions extends LightOptions {
    name?: string;
    /**
     * set to true if you want this light to cast a shadow!
     */
    castShadow?: boolean;
    /**
     * some shadow options to customize how its rendered
     */
    shadowOptions?: {
        /**
         * affects the edges of the shadow to 'soften them' too low, you get banding, to high its to hard!
         * adjust as required!
         */
        poissonSpread?: number;
        /**
         * a bias is useful to stop shadow dithering (mostly when objects are self shadowing)
         */
        bias?: number;
        /**
         * the larger the size if of the shadow map, the greater the resolution. Best to keep it po2!
         */
        size?: number;
        /**
         * set to true if you wan to visualize the shadow casting map
         */
        debug?: boolean;
    };
}
export declare class LightEntity extends Entity3D {
    light: LightComponent;
    shadow: ShadowComponent;
    constructor(lightData?: LightEntityOptions);
    /**
     * adds a shadow caster to a light.
     * gotcha - make sure to add a shadow BEFORE the first render, or the shadow code will not be built in to the shader
     */
    private _addShadowCaster;
    set intensity(value: number);
    get intensity(): number;
    set distance(value: number);
    get distance(): number;
    set color(value: number);
    get color(): number;
    set softness(value: number);
    get softness(): number;
}
//# sourceMappingURL=LightEntity.d.ts.map