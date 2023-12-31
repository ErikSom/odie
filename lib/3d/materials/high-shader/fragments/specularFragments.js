/**
 * this deals with creating the correct specular.
 * accepts uSpecularMap and some tweaking variables
 */
export const specularStandard = {
    fragment: {
        header: `
            uniform vec2 uSpecularGloss;  // power // intensity
            
            uniform sampler2D uSpecularMap;
        `,
        material: `
            specular = uSpecularGloss.x;
            gloss = uSpecularGloss.y;
            
            specular *= texture2DSRGB(uSpecularMap, uv).r;

            //IOS hack.. 
            specular += 0.0000001;
        `,
    },
};
