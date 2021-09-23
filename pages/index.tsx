// eslint-disable-next-line simple-import-sort/imports
import { fibonnaci } from 'lib/fibonacci'
import { goSyntax } from 'lib/go_syntax'
import { initWasm } from 'lib/load_wasm'
import { RunGo } from 'lib/RunGo'
import { highlight } from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/themes/prism-dark.css' // Example style, you can use another

import React, { useEffect, useRef, useState } from 'react'
import Editor from 'react-simple-code-editor'

const Index = () => {
  const [code, setCode] = useState<string>(fibonnaci)
  const [terminalText, setTerminalText] = useState<string>(
    "Click 'Run' to get started! "
  )
  const [loaded, setLoaded] = useState<boolean>(false)
  const runGoRef = useRef<RunGo | undefined>(undefined)

  useEffect(() => {
    const run = async () => {
      const runGo = await initWasm(
        input => setTerminalText(text => text + input),
        input => setTerminalText(text => text + input)
      )
      runGoRef.current = runGo
      setLoaded(true)
    }
    run()
  }, [])

  return (
    <main className="bg-blueGray-900 h-full flex flex-col">
      <div className="bg-blueGray-700 bg-opacity-50 p-4 rounded flex flex-row justify-between items-center">
        <h1 className="text-2xl text-coolGray-50">Go playground WASM</h1>
        <button className="bg-blue-600 text-gray-50 px-4 rounded hover:bg-blue-700 transition-all">
          <a href="https://github.com/zackradisic/go-playground-wasm/">
            View source
          </a>
        </button>
      </div>
      <div className="bg-blueGray-800 bg-opacity-50 text-coolGray-300">
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, goSyntax, 'go')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12
          }}
        />
      </div>
      <div className="bg-blueGray-900 bg-opacity-50 p-4 text-blueGray-50 overflow-auto h-full">
        <div
          className="overflow-auto"
          dangerouslySetInnerHTML={{ __html: terminalText }}></div>
        <div className="absolute bottom-0 right-0 pb-4 pr-4 flex flex-row">
          <button
            onClick={() => {
              if (!loaded) return
              runGoRef.current!.run(code)
            }}
            className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700">
            {!loaded ? 'Loading...' : 'Run'}
          </button>
          <button
            onClick={() => {
              setTerminalText('')
            }}
            className="ml-4 bg-gray-600 px-4 py-1 rounded hover:bg-blue-700">
            Clear
          </button>
        </div>
      </div>
    </main>
  )
}

export default Index
