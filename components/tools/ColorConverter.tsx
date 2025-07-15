import React, { useEffect, useState } from "react";
import { FaCopy, FaPalette } from "react-icons/fa";

function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState("#4f46e5");
  const [rgb, setRgb] = useState("79,70,229");
  const [hsl, setHsl] = useState("241,75%,59%");
  const [inputMode, setInputMode] = useState<"hex" | "rgb" | "hsl">("hex");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (inputMode === "hex") {
        const rgbArr = hexToRgb(hex);
        setRgb(rgbArr.join(","));
        if (rgbArr.length === 3) {
          setHsl(rgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2]).join(",") + "%");
        }
      } else if (inputMode === "rgb") {
        const rgbArr = rgb.split(",").map(Number);
        if (rgbArr.length === 3 && rgbArr.every((n) => !isNaN(n))) {
          setHex(rgbToHex(rgbArr[0], rgbArr[1], rgbArr[2]));
          setHsl(rgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2]).join(",") + "%");
        }
      } else if (inputMode === "hsl") {
        const [h, s, l] = hsl.replace("%", "").split(",").map(Number);
        const rgbArr = hslToRgb(h, s, l);
        setRgb(rgbArr.join(","));
        setHex(rgbToHex(...(rgbArr as [number, number, number])));
      }
    } catch {
      // ignore errors
    }
  }, [hex, rgb, hsl, inputMode]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaPalette className="text-purple-400" /> Conversor de Color
      </h3>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode("hex")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            inputMode === "hex"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          HEX
        </button>
        <button
          onClick={() => setInputMode("rgb")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            inputMode === "rgb"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          RGB
        </button>
        <button
          onClick={() => setInputMode("hsl")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            inputMode === "hsl"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          HSL
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-300 mb-1 font-medium">HEX</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              setInputMode("hex");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            maxLength={7}
          />
          <button
            onClick={() => copy(hex, "hex")}
            className="mt-1 text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            <FaCopy /> Copiar
            {copied === "hex" && (
              <span className="ml-1 text-green-400">¡Copiado!</span>
            )}
          </button>
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-medium">RGB</label>
          <input
            type="text"
            value={rgb}
            onChange={(e) => {
              setRgb(e.target.value);
              setInputMode("rgb");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Ej: 79,70,229"
          />
          <button
            onClick={() => copy(`rgb(${rgb})`, "rgb")}
            className="mt-1 text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            <FaCopy /> Copiar
            {copied === "rgb" && (
              <span className="ml-1 text-green-400">¡Copiado!</span>
            )}
          </button>
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-medium">HSL</label>
          <input
            type="text"
            value={hsl}
            onChange={(e) => {
              setHsl(e.target.value);
              setInputMode("hsl");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Ej: 241,75%,59%"
          />
          <button
            onClick={() => copy(`hsl(${hsl})`, "hsl")}
            className="mt-1 text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            <FaCopy /> Copiar
            {copied === "hsl" && (
              <span className="ml-1 text-green-400">¡Copiado!</span>
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div
          className="w-16 h-16 rounded-lg border-2 border-purple-700"
          style={{ background: hex }}
          title={hex}
        ></div>
        <span className="text-gray-400 text-xs">Vista previa</span>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Convierte entre HEX, RGB y HSL. Copia cualquier formato y visualiza el
        color.
      </div>
    </div>
  );
};

export default ColorConverter;
