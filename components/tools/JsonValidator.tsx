import yaml from "js-yaml";
import React, { useEffect, useRef, useState } from "react";
import { FaCodeBranch, FaCopy, FaDownload, FaFileImport, FaTrash } from "react-icons/fa";

function getJsonStats(obj: any) {
  let keys = 0,
    arrays = 0,
    objects = 0,
    maxDepth = 0;
  const keySet = new Set<string>();
  function walk(o: any, depth: number) {
    if (Array.isArray(o)) {
      arrays++;
      maxDepth = Math.max(maxDepth, depth);
      o.forEach((v) => walk(v, depth + 1));
    } else if (o && typeof o === "object") {
      objects++;
      maxDepth = Math.max(maxDepth, depth);
      for (const k in o) {
        keys++;
        keySet.add(k);
        walk(o[k], depth + 1);
      }
    }
  }
  walk(obj, 1);
  return {
    keys,
    arrays,
    objects,
    maxDepth,
    uniqueKeys: keySet.size,
    types: getJsonTypes(obj),
  };
}

function getJsonTypes(obj: any, types = new Set<string>()) {
  if (Array.isArray(obj)) {
    types.add("array");
    obj.forEach((v) => getJsonTypes(v, types));
  } else if (obj && typeof obj === "object") {
    types.add("object");
    Object.values(obj).forEach((v) => getJsonTypes(v, types));
  } else {
    types.add(typeof obj);
  }
  return Array.from(types);
}

function jsonToCsv(json: any): string {
  if (!Array.isArray(json)) return "";
  if (json.length === 0) return "";
  const keys = Object.keys(json[0]);
  const csvRows = [
    keys.join(","),
    ...json.map((row) =>
      keys.map((k) => JSON.stringify(row[k] ?? "")).join(",")
    ),
  ];
  return csvRows.join("\n");
}

function csvToJson(csv: string): any[] {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  const keys = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const obj: any = {};
    keys.forEach((k, i) => (obj[k] = JSON.parse(values[i] || '""')));
    return obj;
  });
}

export const JsonValidator: React.FC = () => {
  const [input, setInput] = useState("{\n  \n}");
  const [result, setResult] = useState<{
    valid: boolean;
    error?: string;
    line?: number;
    suggestion?: string;
    stats?: {
      keys: number;
      arrays: number;
      objects: number;
      maxDepth: number;
      size: number;
      uniqueKeys: number;
      types: string[];
    };
    parsed?: any;
  }>({
    valid: true,
    stats: {
      keys: 0,
      arrays: 0,
      objects: 0,
      maxDepth: 0,
      size: 0,
      uniqueKeys: 0,
      types: [],
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Estados para conversiones
  const [yamlValue, setYamlValue] = useState("");
  const [csvValue, setCsvValue] = useState("");
  const [base64Value, setBase64Value] = useState("");
  const [formatMode, setFormatMode] = useState<"pretty" | "compact">("pretty");
  const [activeConverter, setActiveConverter] = useState<
    "yaml" | "base64" | "csv"
  >("yaml");
  const [copied, setCopied] = useState<string | null>(null);

  function validateJson(str: string) {
    try {
      const parsed = JSON.parse(str);
      const stats = getJsonStats(parsed);
      const size = new Blob([str]).size;
      setResult({ valid: true, stats: { ...stats, size }, parsed });
      setYamlValue(yaml.dump(parsed));
      setBase64Value(btoa(unescape(encodeURIComponent(str))));
      setCsvValue(Array.isArray(parsed) ? jsonToCsv(parsed) : "");
    } catch (e: any) {
      let line = 1;
      const m = /at position (\d+)/.exec(e.message);
      if (m) {
        const pos = parseInt(m[1]);
        line = str.slice(0, pos).split("\n").length;
      }
      let suggestion =
        "Revisa la sintaxis JSON. Usa comillas dobles, separa con comas y verifica llaves/corchetes.";
      if (/Unexpected token/.test(e.message))
        suggestion =
          "Puede que falte una coma, comillas o haya un carácter inesperado.";
      if (/Unexpected end/.test(e.message))
        suggestion = "Parece que falta cerrar una llave, corchete o comillas.";
      setResult({ valid: false, error: e.message, line, suggestion });
      setYamlValue("");
      setBase64Value("");
      setCsvValue("");
    }
  }

  const handleFormat = (mode: "pretty" | "compact") => {
    if (!result.valid || !result.parsed) return;
    setInput(
      mode === "pretty"
        ? JSON.stringify(result.parsed, null, 2)
        : JSON.stringify(result.parsed)
    );
    setFormatMode(mode);
  };

  const handleYamlFormat = (pretty: boolean) => {
    if (!result.valid || !result.parsed) return;
    setYamlValue(
      pretty
        ? yaml.dump(result.parsed)
        : yaml.dump(result.parsed, { indent: 0, flowLevel: -1 })
    );
  };

  const copyToClipboard = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const downloadFile = (
    content: string,
    filename: string,
    type = "text/plain"
  ) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleYamlToJson = () => {
    try {
      const obj = yaml.load(yamlValue);
      setInput(JSON.stringify(obj, null, 2));
    } catch (e) {
      alert("YAML inválido");
    }
  };
  const handleBase64ToJson = () => {
    try {
      const str = decodeURIComponent(escape(atob(base64Value)));
      setInput(str);
    } catch (e) {
      alert("Base64 inválido");
    }
  };
  const handleCsvToJson = () => {
    try {
      const arr = csvToJson(csvValue);
      setInput(JSON.stringify(arr, null, 2));
    } catch (e) {
      alert("CSV inválido");
    }
  };

  useEffect(() => {
    validateJson(input);
    // eslint-disable-next-line
  }, [input]);

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaCodeBranch className="text-purple-400" /> Validador y Herramientas
        JSON
      </h3>
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none resize-vertical"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Pega aquí tu código JSON..."
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleFormat("pretty")}
          className="px-3 py-1 bg-purple-700 text-white rounded text-xs"
        >
          Formatear
        </button>
        <button
          onClick={() => handleFormat("compact")}
          className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs"
        >
          Minificar
        </button>
        <button
          onClick={() => setInput("")}
          className="px-3 py-1 bg-red-700 text-white rounded text-xs"
        >
          <FaTrash className="inline" /> Limpiar
        </button>
        <button
          onClick={() => copyToClipboard(input, "json")}
          className="px-3 py-1 bg-blue-700 text-white rounded text-xs"
        >
          <FaCopy className="inline" /> Copiar JSON
        </button>
        <button
          onClick={() => downloadFile(input, "data.json", "application/json")}
          className="px-3 py-1 bg-green-700 text-white rounded text-xs"
        >
          <FaDownload className="inline" /> Descargar JSON
        </button>
        <label className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs cursor-pointer flex items-center gap-1">
          <FaFileImport /> Importar
          <input
            type="file"
            accept=".json,.txt"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      {result.valid ? (
        <div className="bg-green-900/40 border border-green-700 rounded-lg p-4 text-green-200 mb-6">
          <b>JSON válido.</b>
          <div className="mt-2 text-sm grid grid-cols-2 gap-2">
            <span>
              Claves totales: <b>{result.stats?.keys}</b>
            </span>
            <span>
              Claves únicas: <b>{result.stats?.uniqueKeys}</b>
            </span>
            <span>
              Objetos: <b>{result.stats?.objects}</b>
            </span>
            <span>
              Arrays: <b>{result.stats?.arrays}</b>
            </span>
            <span>
              Profundidad máxima: <b>{result.stats?.maxDepth}</b>
            </span>
            <span>
              Tamaño: <b>{result.stats?.size} bytes</b>
            </span>
            <span>
              Tipos: <b>{result.stats?.types?.join(", ")}</b>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-red-200 mb-6">
          <b>Error de sintaxis:</b> {result.error}
          <br />
          <span>
            Línea: <b>{result.line}</b>
          </span>
          <br />
          <span>Sugerencia: {result.suggestion}</span>
        </div>
      )}

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveConverter("yaml")}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            activeConverter === "yaml"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-900/30"
          }`}
        >
          YAML
        </button>
        <button
          onClick={() => setActiveConverter("base64")}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            activeConverter === "base64"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-900/30"
          }`}
        >
          Base64
        </button>
        <button
          onClick={() => setActiveConverter("csv")}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            activeConverter === "csv"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-900/30"
          }`}
        >
          CSV
        </button>
      </div>

      {activeConverter === "yaml" && (
        <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 flex flex-col mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-purple-300">YAML</span>
            <button
              onClick={() => handleYamlFormat(true)}
              className="px-2 py-0.5 text-xs bg-purple-700 text-white rounded"
            >
              Beautify
            </button>
            <button
              onClick={() => handleYamlFormat(false)}
              className="px-2 py-0.5 text-xs bg-gray-700 text-gray-200 rounded"
            >
              Minify
            </button>
            <button
              onClick={() => copyToClipboard(yamlValue, "yaml")}
              className="px-2 py-0.5 text-xs bg-blue-700 text-white rounded"
            >
              <FaCopy className="inline" /> Copiar
            </button>
            <button
              onClick={() => downloadFile(yamlValue, "data.yaml", "text/yaml")}
              className="px-2 py-0.5 text-xs bg-green-700 text-white rounded"
            >
              <FaDownload className="inline" /> Descargar
            </button>
            <button
              onClick={handleYamlToJson}
              className="px-2 py-0.5 text-xs bg-pink-700 text-white rounded"
            >
              YAML → JSON
            </button>
            {copied === "yaml" && (
              <span className="ml-1 text-green-400 text-xs">¡Copiado!</span>
            )}
          </div>
          <textarea
            value={yamlValue}
            onChange={(e) => setYamlValue(e.target.value)}
            className="w-full h-24 md:h-32 px-2 py-1 rounded bg-gray-800 text-gray-200 font-mono text-xs mb-1"
            spellCheck={false}
            placeholder="YAML convertido"
          />
        </div>
      )}
      {activeConverter === "base64" && (
        <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 flex flex-col mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-purple-300">Base64</span>
            <button
              onClick={() => copyToClipboard(base64Value, "base64")}
              className="px-2 py-0.5 text-xs bg-blue-700 text-white rounded"
            >
              <FaCopy className="inline" /> Copiar
            </button>
            <button
              onClick={() =>
                downloadFile(base64Value, "data.b64", "text/plain")
              }
              className="px-2 py-0.5 text-xs bg-green-700 text-white rounded"
            >
              <FaDownload className="inline" /> Descargar
            </button>
            <button
              onClick={handleBase64ToJson}
              className="px-2 py-0.5 text-xs bg-pink-700 text-white rounded"
            >
              Base64 → JSON
            </button>
            {copied === "base64" && (
              <span className="ml-1 text-green-400 text-xs">¡Copiado!</span>
            )}
          </div>
          <textarea
            value={base64Value}
            onChange={(e) => setBase64Value(e.target.value)}
            className="w-full h-24 md:h-32 px-2 py-1 rounded bg-gray-800 text-gray-200 font-mono text-xs mb-1"
            spellCheck={false}
            placeholder="Base64 convertido"
          />
        </div>
      )}
      {activeConverter === "csv" && (
        <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 flex flex-col mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-purple-300">CSV</span>
            <button
              onClick={() => copyToClipboard(csvValue, "csv")}
              className="px-2 py-0.5 text-xs bg-blue-700 text-white rounded"
            >
              <FaCopy className="inline" /> Copiar
            </button>
            <button
              onClick={() => downloadFile(csvValue, "data.csv", "text/csv")}
              className="px-2 py-0.5 text-xs bg-green-700 text-white rounded"
            >
              <FaDownload className="inline" /> Descargar
            </button>
            <button
              onClick={handleCsvToJson}
              className="px-2 py-0.5 text-xs bg-pink-700 text-white rounded"
            >
              CSV → JSON
            </button>
            {copied === "csv" && (
              <span className="ml-1 text-green-400 text-xs">¡Copiado!</span>
            )}
          </div>
          <textarea
            value={csvValue}
            onChange={(e) => setCsvValue(e.target.value)}
            className="w-full h-24 md:h-32 px-2 py-1 rounded bg-gray-800 text-gray-200 font-mono text-xs mb-1"
            spellCheck={false}
            placeholder="CSV convertido (solo arrays de objetos)"
          />
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        Valida, formatea y convierte JSON. Copia, importa/exporta y obtén
        estadísticas avanzadas.
      </div>
    </div>
  );
};

export default JsonValidator;
