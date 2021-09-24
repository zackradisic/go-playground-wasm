/* eslint-disable camelcase */
import { WasmAlloc, WasmDealloc, WasmRunFn } from '@type/types'
import { WASI } from '@wasmer/wasi'
import { lowerI64Imports } from '@wasmer/wasm-transformer'
import { WasmFs } from '@wasmer/wasmfs'
import * as fflate from 'fflate'
import * as path from 'isomorphic-path'

import { RunGo } from './RunGo'

const instantiateWasm = async (wasi: WASI) => {
  const binary = await (await fetch('/wasm.wasm')).arrayBuffer()
  const loweredBinary = await lowerI64Imports(new Uint8Array(binary))
  const module = await WebAssembly.compile(loweredBinary)
  const imports = wasi.getImports(module)
  const instance = await WebAssembly.instantiate(module, {
    ...imports
  })
  wasi.start(instance)

  return instance.exports
}

const setupFs = async (
  fs: WasmFs,
  stdout: (input: string) => void,
  stderr: (input: string) => void
) => {
  // Fetch and write stdlib to FS
  const zipped = await (await fetch('/stdlib.zip')).arrayBuffer()
  const unzipped = fflate.unzipSync(new Uint8Array(zipped))
  for (const [key, val] of Object.entries(unzipped)) {
    if (val.length !== 0) {
      console.log(key)
      const dir = path.dirname(key)
      if (!fs.fs.existsSync(dir)) {
        fs.fs.mkdirpSync(dir)
      }
      fs.fs.writeFileSync(key, val)
    }
  }

  // Intercept stdout and stderr
  const oldWrite = fs.fs.writeSync
  const textDecoder = new TextDecoder()
  // @ts-ignore
  fs.fs.writeSync = (fd, buffer, offset, length, position) => {
    if (fd === 1) {
      stdout(textDecoder.decode(buffer).replace('\n', '<br />'))
      return buffer.length
    }
    if (fd === 2) {
      stderr(textDecoder.decode(buffer).replace('\n', '<br />'))
      return buffer.length
    }
    return oldWrite(fd, buffer, offset, length, position)
  }
}

export const initWasm = async (
  stdin: (input: string) => void,
  stdout: (inupt: string) => void
) => {
  const wasmFs = new WasmFs()
  await setupFs(wasmFs, stdin, stdout)

  const wasi = new WASI({
    args: [],
    env: {},
    bindings: {
      ...WASI.defaultBindings,
      fs: wasmFs.fs,
      // https://github.com/wasmerio/wasmer-js/issues/253
      path: WASI.defaultBindings.path.default
    },
    preopens: {
      '/': '/',
      '.': '.'
    }
  })

  const exports = await instantiateWasm(wasi)
  const memory = exports.memory as WebAssembly.Memory
  const { run_go, alloc, dealloc } = exports as {
    run_go: WasmRunFn
    alloc: WasmAlloc
    dealloc: WasmDealloc
  }
  return new RunGo(memory, wasmFs, run_go, alloc, dealloc)
}
