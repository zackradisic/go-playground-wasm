export type WasmRunFn = (pathPtr: number) => number
export type WasmAlloc = (size: number) => number
export type WasmDealloc = (ptr: number) => number
