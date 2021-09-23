import { WasmAlloc, WasmDealloc, WasmRunFn } from '@type/types'
import { WasmFs } from '@wasmer/wasmfs'

const SCRIPT_PATH = '/script.gos'

export class RunGo {
  memory: WebAssembly.Memory
  wasmFs: WasmFs

  runFn: WasmRunFn
  alloc: WasmAlloc
  dealloc: WasmDealloc

  scriptPathPtr: number

  constructor(
    memory: WebAssembly.Memory,
    wasmFs: WasmFs,
    runFn: WasmRunFn,
    alloc: WasmAlloc,
    dealloc: WasmDealloc
  ) {
    this.memory = memory
    this.wasmFs = wasmFs

    this.runFn = runFn
    this.alloc = alloc
    this.dealloc = dealloc

    // Write script path now since it's constant
    const strBuf = new TextEncoder().encode(SCRIPT_PATH)
    const ptr = this.alloc(strBuf.length)
    const memBuf = new Uint8Array(this.memory.buffer, ptr, strBuf.length)
    memBuf.set(strBuf)
    this.scriptPathPtr = ptr
  }

  run(code: string) {
    this.wasmFs.fs.writeFileSync(SCRIPT_PATH, new TextEncoder().encode(code))

    console.log('Running')
    return this.runFn(this.scriptPathPtr)
  }
}
