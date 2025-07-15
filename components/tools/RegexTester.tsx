import React, { useEffect, useState } from "react";
import { FaCodeBranch, FaCopy, FaInfoCircle, FaTrash } from "react-icons/fa";

const FLAG_HELP =
  "g: global, i: insensible a mayúsculas, m: multilínea, s: dotAll, u: unicode, y: sticky";

function highlightMatches(text: string, regex: RegExp) {
  if (!text || !regex) return text;
  let lastIndex = 0;
  let result: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let idx = 0;
  regex.lastIndex = 0;
  while ((m = regex.exec(text))) {
    const start = m.index;
    const end = regex.lastIndex;
    if (start > lastIndex) result.push(text.slice(lastIndex, start));
    result.push(
      <mark
        key={idx++}
        className="bg-purple-700/60 text-white rounded px-1"
        title="Coincidencia"
      >
        {text.slice(start, end)}
      </mark>
    );
    lastIndex = end;
    if (!regex.global) break;
    if (end === start) regex.lastIndex++;
  }
  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result.length ? result : text;
}

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      setError(null);
      if (!pattern) {
        setMatches([]);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const found = Array.from(testString.matchAll(regex)).map((m) => m[0]);
      setMatches(found);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const clearAll = () => {
    setPattern("");
    setFlags("g");
    setTestString("");
    setMatches([]);
    setError(null);
  };

  let regex: RegExp | null = null;
  try {
    if (pattern) regex = new RegExp(pattern, flags);
  } catch {
    regex = null;
  }

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaCodeBranch className="text-purple-400" /> Tester de Expresiones
        Regulares
      </h3>
      <div className="flex flex-col md:flex-row gap-4 mb-3">
        <div className="flex-1">
          <label className="block text-gray-300 mb-1 font-medium">
            Expresión Regular
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Ej: ^[a-zA-Z0-9]+$"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-medium flex items-center gap-1">
            Flags
            <span title={FLAG_HELP}>
              <FaInfoCircle className="text-blue-400" />
            </span>
          </label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            className="w-20 px-2 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            maxLength={6}
            placeholder="gim"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={clearAll}
            className="px-3 py-2 bg-red-700 text-white rounded text-xs flex items-center gap-1"
            title="Limpiar todo"
          >
            <FaTrash /> Limpiar
          </button>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-gray-300 mb-1 font-medium">
          Texto de Prueba
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-24 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
          placeholder="Introduce el texto a analizar..."
        />
      </div>
      {error ? (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-3 text-red-200 mb-2">
          <b>Error de sintaxis:</b> {error}
        </div>
      ) : (
        <div className="bg-green-900/40 border border-green-700 rounded-lg p-3 text-green-200 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <b>Coincidencias encontradas:</b> {matches.length}
            <button
              onClick={() => copy(pattern, "pattern")}
              className="text-blue-400 hover:text-blue-200 text-xs flex items-center ml-2"
              title="Copiar patrón"
            >
              <FaCopy className="inline" />
              {copied === "pattern" && (
                <span className="ml-1 text-green-400">¡Copiado!</span>
              )}
            </button>
            {matches.length > 0 && (
              <button
                onClick={() => copy(matches.join("\n"), "matches")}
                className="text-blue-400 hover:text-blue-200 text-xs flex items-center ml-2"
                title="Copiar coincidencias"
              >
                <FaCopy className="inline" />
                {copied === "matches" && (
                  <span className="ml-1 text-green-400">¡Copiado!</span>
                )}
              </button>
            )}
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="bg-gray-900 px-2 py-1 rounded text-purple-300 font-mono break-all"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mb-2">
        <label className="block text-gray-300 mb-1 font-medium">
          Resultado con resaltado:
        </label>
        <div className="bg-gray-900 rounded p-3 font-mono text-gray-200 whitespace-pre-wrap break-all min-h-[48px]">
          {regex && testString
            ? highlightMatches(testString, regex)
            : testString}
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Soporta flags: <b>g</b> (global), <b>i</b> (insensible a mayúsculas),{" "}
        <b>m</b> (multilínea), <b>s</b> (dotAll), <b>u</b> (unicode), <b>y</b>{" "}
        (sticky).
        <br />
        Puedes copiar el patrón o las coincidencias encontradas.
      </div>
    </div>
  );
};