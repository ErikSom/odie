import type { Signal } from 'typed-signals';
export declare type Mutable<T> = {
    -readonly [P in keyof T]: T[P] extends readonly (infer U)[] ? Mutable<U>[] : Mutable<T[P]>;
};
export declare type SignalHash = Record<string, Signal<(...args: unknown[]) => void>>;
export declare type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | number[];
export declare type FixedNumberArray<L extends number> = ([number, ...number[]] & {
    length: L;
}) & TypedArray;
//# sourceMappingURL=Types.d.ts.map