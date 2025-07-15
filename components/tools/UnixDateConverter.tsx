import React, { useEffect, useState } from "react";
import { FaClock, FaCopy, FaHistory } from "react-icons/fa";

export const UnixDateConverter: React.FC = () => {
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000));
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });
  const [copied, setCopied] = useState<string | null>(null);

  // Actualiza la fecha cuando cambia el unix
  useEffect(() => {
    const d = new Date(unix * 1000);
    setDate(d.toISOString().slice(0, 16));
  }, [unix]);

  // Actualiza el unix cuando cambia la fecha
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    const d = new Date(e.target.value);
    setUnix(Math.floor(d.getTime() / 1000));
  };

  const handleUnixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setUnix(val);
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  const setNow = () => {
    const now = new Date();
    setUnix(Math.floor(now.getTime() / 1000));
    setDate(now.toISOString().slice(0, 16));
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaHistory className="text-purple-400" /> Conversor de Fechas Unix
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-gray-300 mb-2 font-medium">
            Timestamp Unix (segundos)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={unix}
              onChange={handleUnixChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <button
              onClick={() => copy(unix.toString(), "unix")}
              className="text-blue-400 hover:text-blue-200 text-xs flex items-center"
              title="Copiar timestamp"
            >
              <FaCopy />
              {copied === "unix" && (
                <span className="ml-1 text-green-400">¡Copiado!</span>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha legible (UTC)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="datetime-local"
              value={date}
              onChange={handleDateChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <button
              onClick={() => copy(date, "date")}
              className="text-blue-400 hover:text-blue-200 text-xs flex items-center"
              title="Copiar fecha"
            >
              <FaCopy />
              {copied === "date" && (
                <span className="ml-1 text-green-400">¡Copiado!</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={setNow}
          className="px-3 py-1 bg-purple-700 text-white rounded text-xs flex items-center gap-1"
        >
          <FaClock /> Ahora
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Convierte entre timestamp Unix y fecha legible. Copia ambos formatos y
        usa "Ahora" para la fecha actual.
      </div>
    </div>
  );
};

export default UnixDateConverter;
