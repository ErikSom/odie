export declare class AmbientLight {
    output: Float32Array;
    dirty: boolean;
    private readonly _color;
    private _hexColor;
    private _intensity;
    constructor(color?: number, intensity?: number);
    update(): void;
    set color(value: number);
    get color(): number;
    set intensity(value: number);
    get intensity(): number;
}
//# sourceMappingURL=AmbientLight.d.ts.map