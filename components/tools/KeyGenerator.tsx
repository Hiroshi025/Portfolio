import React, { useEffect, useState } from "react";
import {
	FaBarcode, FaCodeBranch, FaCopy, FaDownload, FaFileImport, FaFingerprint, FaKey, FaLock,
	FaRandom, FaShieldAlt, FaTrash
} from "react-icons/fa";

function randomString(length: number, chars: string) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function uuidv4() {
  // RFC4122 version 4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nanoid(size = 21) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
  return randomString(size, chars);
}

function entropy(bits: number) {
  if (!bits) return "0 bits";
  if (bits < 40) return `${bits} bits (muy débil)`;
  if (bits < 60) return `${bits} bits (débil)`;
  if (bits < 80) return `${bits} bits (media)`;
  if (bits < 128) return `${bits} bits (fuerte)`;
  return `${bits} bits (muy fuerte)`;
}

function calcEntropy(length: number, charsetSize: number) {
  return Math.round(length * Math.log2(charsetSize));
}

const DEFAULT_PAYLOAD = JSON.stringify(
  {
    sub: "user_id",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  null,
  2
);

export const KeyGenerator: React.FC = () => {
  const [type, setType] = useState<
    "license" | "jwt" | "password" | "apikey" | "uuid" | "nanoid" | "custom"
  >("license");
  const [length, setLength] = useState(32);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  // Password options
  const [pwOptions, setPwOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  // Password strength
  const [pwStrength, setPwStrength] = useState({
    score: 0,
    label: "Débil",
    color: "red",
    entropy: 0,
  });

  // JWT payload
  const [jwtPayload, setJwtPayload] = useState(DEFAULT_PAYLOAD);

  // Custom charset
  const [customCharset, setCustomCharset] = useState(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  );

  // Import/export
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setResult(ev.target?.result as string);
    };
    reader.readAsText(file);
  };
  const handleExport = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "key.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Password generator
  function generatePassword(length: number, opts: typeof pwOptions) {
    let chars = "";
    if (opts.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (opts.numbers) chars += "0123456789";
    if (opts.symbols) chars += "!@#$%^&*()-_=+[]{};:,.<>/?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    return randomString(length, chars);
  }

  // Password strength
  function evaluatePasswordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 20) score++;
    let label = "Débil",
      color = "red";
    if (score >= 5) {
      label = "Muy fuerte";
      color = "green";
    } else if (score >= 4) {
      label = "Fuerte";
      color = "limegreen";
    } else if (score >= 3) {
      label = "Media";
      color = "orange";
    }
    // Entropía
    let charsetSize = 0;
    if (/[A-Z]/.test(pw)) charsetSize += 26;
    if (/[a-z]/.test(pw)) charsetSize += 26;
    if (/\d/.test(pw)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pw)) charsetSize += 32;
    setPwStrength({
      score,
      label,
      color,
      entropy: calcEntropy(pw.length, charsetSize || 1),
    });
  }

  // Generate key
  const generate = () => {
    let val = "";
    if (type === "license") {
      // XXXX-XXXX-XXXX-XXXX
      let groups = Math.ceil(length / 4);
      let arr = [];
      for (let g = 0; g < groups; g++) {
        arr.push(randomString(4, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"));
      }
      val = arr.join("-");
    } else if (type === "jwt") {
      let header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(
        /=+$/,
        ""
      );
      let payload = "";
      try {
        payload = btoa(jwtPayload).replace(/=+$/, "");
      } catch {
        payload = btoa(DEFAULT_PAYLOAD).replace(/=+$/, "");
      }
      const signature = randomString(
        length,
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      );
      val = `${header}.${payload}.${signature}`;
    } else if (type === "password") {
      val = generatePassword(length, pwOptions);
      evaluatePasswordStrength(val);
    } else if (type === "apikey") {
      val = randomString(
        length,
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      );
    } else if (type === "uuid") {
      val = uuidv4();
    } else if (type === "nanoid") {
      val = nanoid(length);
    } else if (type === "custom") {
      val = randomString(length, customCharset || "abc");
    }
    setResult(val);
    if (type === "password") evaluatePasswordStrength(val);
  };

  // Update strength on manual edit
  useEffect(() => {
    if (type === "password") evaluatePasswordStrength(result);
    // eslint-disable-next-line
  }, [result]);

  // Auto-generate on type/length/options change
  useEffect(() => {
    generate();
    // eslint-disable-next-line
  }, [type, length, pwOptions, jwtPayload, customCharset]);

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const clear = () => setResult("");

  // Entropy info
  let entropyInfo = "";
  if (type === "password") {
    entropyInfo = entropy(pwStrength.entropy);
  } else if (type === "apikey" || type === "nanoid" || type === "custom") {
    let charsetSize =
      type === "apikey"
        ? 62
        : type === "nanoid"
        ? 64
        : customCharset.length || 1;
    entropyInfo = entropy(calcEntropy(length, charsetSize));
  }

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaKey className="text-purple-400" /> Generador de Claves Avanzado
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setType("license")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "license"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaBarcode className="inline mr-1" /> Licencia
        </button>
        <button
          onClick={() => setType("jwt")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "jwt"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaShieldAlt className="inline mr-1" /> JWT
        </button>
        <button
          onClick={() => setType("password")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "password"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaLock className="inline mr-1" /> Contraseña
        </button>
        <button
          onClick={() => setType("apikey")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "apikey"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaKey className="inline mr-1" /> API Key
        </button>
        <button
          onClick={() => setType("uuid")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "uuid"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaFingerprint className="inline mr-1" /> UUID
        </button>
        <button
          onClick={() => setType("nanoid")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "nanoid"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaCodeBranch className="inline mr-1" /> NanoID
        </button>
        <button
          onClick={() => setType("custom")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            type === "custom"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          <FaRandom className="inline mr-1" /> Personalizado
        </button>
      </div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-1 font-medium">
            Longitud
          </label>
          <input
            type="number"
            min={type === "jwt" ? 16 : 4}
            max={type === "jwt" ? 128 : 128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
          />
        </div>
        {type === "custom" && (
          <div>
            <label className="block text-gray-300 mb-1 font-medium">
              Caracteres Personalizados
            </label>
            <input
              type="text"
              value={customCharset}
              onChange={(e) => setCustomCharset(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
              placeholder="Ej: ABCabc123!@#"
            />
          </div>
        )}
      </div>
      {type === "password" && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">
            Opciones de Contraseña
          </label>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={pwOptions.uppercase}
                onChange={(e) =>
                  setPwOptions((o) => ({ ...o, uppercase: e.target.checked }))
                }
              />
              <span className="text-gray-200">Mayúsculas</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={pwOptions.lowercase}
                onChange={(e) =>
                  setPwOptions((o) => ({ ...o, lowercase: e.target.checked }))
                }
              />
              <span className="text-gray-200">Minúsculas</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={pwOptions.numbers}
                onChange={(e) =>
                  setPwOptions((o) => ({ ...o, numbers: e.target.checked }))
                }
              />
              <span className="text-gray-200">Números</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={pwOptions.symbols}
                onChange={(e) =>
                  setPwOptions((o) => ({ ...o, symbols: e.target.checked }))
                }
              />
              <span className="text-gray-200">Símbolos</span>
            </label>
          </div>
        </div>
      )}
      {type === "jwt" && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">
            Payload (JSON)
          </label>
          <textarea
            value={jwtPayload}
            onChange={(e) => setJwtPayload(e.target.value)}
            className="w-full h-20 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
          />
          <span className="text-xs text-gray-400">
            Puedes personalizar el contenido del payload.
          </span>
        </div>
      )}
      <div className="flex gap-2 mb-4">
        <button
          onClick={generate}
          className="px-4 py-2 bg-purple-700 text-white rounded text-xs flex items-center gap-1"
        >
          <FaRandom /> Generar
        </button>
        <button
          onClick={copy}
          className="px-4 py-2 bg-blue-700 text-white rounded text-xs flex items-center gap-1"
        >
          <FaCopy /> {copied ? "¡Copiado!" : "Copiar"}
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-red-700 text-white rounded text-xs flex items-center gap-1"
        >
          <FaTrash /> Limpiar
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-700 text-white rounded text-xs flex items-center gap-1"
        >
          <FaDownload /> Exportar
        </button>
        <label className="px-4 py-2 bg-gray-700 text-gray-200 rounded text-xs flex items-center gap-1 cursor-pointer">
          <FaFileImport /> Importar
          <input
            type="file"
            accept=".txt"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-gray-300 mb-1 font-medium">
          Resultado
        </label>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="w-full h-20 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
        />
      </div>
      {/* Password strength/entropy */}
      {(type === "password" ||
        type === "apikey" ||
        type === "nanoid" ||
        type === "custom") && (
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-3 w-24 rounded-full"
            style={{
              background: type === "password" ? pwStrength.color : "#6366f1",
              opacity: 0.7,
            }}
          ></div>
          <span
            className="text-sm font-bold"
            style={{
              color: type === "password" ? pwStrength.color : "#6366f1",
            }}
          >
            {type === "password" ? pwStrength.label : "Entropía"}
          </span>
          <span className="text-xs text-gray-400 ml-2">{entropyInfo}</span>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        Genera licencias, JWT, contraseñas, API keys, UUID, NanoID y claves
        personalizadas. Copia, exporta, importa y revisa la entropía y
        seguridad.
      </div>
    </div>
  );
};

export default KeyGenerator;
