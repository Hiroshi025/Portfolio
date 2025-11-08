"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FaPlay, FaTrash } from "react-icons/fa"

export function CodePlayground() {
  const [code, setCode] = useState(`// Escribe tu código JavaScript aquí
console.log("¡Hola desde el playground!");

// Ejemplo: obtener datos de una API
fetch('https://api.github.com/users/Hiroshi025')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`)
  const [output, setOutput] = useState<string[]>([])

  const runCode = () => {
    const logs: string[] = []
    const originalLog = console.log
    const originalError = console.error

    console.log = (...args) => {
      logs.push(args.map((arg) => JSON.stringify(arg, null, 2)).join(" "))
      originalLog(...args)
    }

    console.error = (...args) => {
      logs.push(`Error: ${args.map((arg) => JSON.stringify(arg, null, 2)).join(" ")}`)
      originalError(...args)
    }

    try {
      // eslint-disable-next-line no-eval
      eval(code)
      setTimeout(() => {
        setOutput(logs.length > 0 ? logs : ["Código ejecutado sin salida"])
      }, 100)
    } catch (error) {
      setOutput([`Error: ${(error as Error).message}`])
    } finally {
      console.log = originalLog
      console.error = originalError
    }
  }

  const clearOutput = () => {
    setOutput([])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-300 mb-2 block">Editor de Código</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 px-4 py-3 rounded-lg bg-gray-900/80 border border-purple-700/50 text-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Escribe tu código JavaScript aquí..."
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={runCode}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <FaPlay className="mr-2" /> Ejecutar
        </Button>
        <Button
          onClick={clearOutput}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-900/30 bg-transparent"
        >
          <FaTrash className="mr-2" /> Limpiar Consola
        </Button>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-300 mb-2 block">Consola de Salida</label>
        <div className="w-full min-h-[150px] max-h-[300px] overflow-y-auto px-4 py-3 rounded-lg bg-gray-900/80 border border-purple-700/50 font-mono text-sm">
          {output.length > 0 ? (
            output.map((line, index) => (
              <div key={index} className="text-gray-300 mb-1">
                {line}
              </div>
            ))
          ) : (
            <div className="text-gray-500">La salida aparecerá aquí...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodePlayground
