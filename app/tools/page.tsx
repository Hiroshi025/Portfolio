"use client";

import type React from "react";

import { AnimatePresence, m, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	FaCode, FaCompress, FaCopy, FaDownload, FaExpand, FaGithub, FaHistory, FaKey, FaPalette,
	FaQuestionCircle, FaRegLightbulb, FaSearch, FaTools, FaTwitter
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";

import { CodePlayground } from "@/components/tools/CodePlayground";
import ColorConverter from "@/components/tools/ColorConverter";
import JsonValidator from "@/components/tools/JsonValidator";
import KeyGenerator from "@/components/tools/KeyGenerator";
import { useNotification } from "@/components/tools/NotificationContext";
import { RegexTester } from "@/components/tools/RegexTester";
import UnixDateConverter from "@/components/tools/UnixDateConverter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

type Tool = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  component: React.ReactNode;
  examples?: string[];
  longDescription?: string;
  documentation?: React.ReactNode;
};

const tools: Tool[] = [
  {
    id: "json-validator",
    title: "Validador JSON",
    icon: <FaCode className="text-blue-400" />,
    description: "Valida y formatea código JSON",
    longDescription:
      "Herramienta profesional para validar, formatear y analizar documentos JSON. Detecta errores de sintaxis, muestra estadísticas del documento y permite formatear con diferentes niveles de indentación.",
    category: "Desarrollo",
    component: <JsonValidator />,
    examples: [
      `{
  "usuario": {
    "id": 123,
    "nombre": "Ana",
    "roles": ["admin", "editor"],
    "activo": true,
    "perfil": {
      "edad": 28,
      "email": "ana@email.com"
    }
  }
}`,
      `[
  { "producto": "Laptop", "precio": 1200, "stock": 5 },
  { "producto": "Mouse", "precio": 25, "stock": 100 }
]`,
      `{
  "config": {
    "theme": "dark",
    "notifications": { "email": true, "sms": false }
  }
}`,
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">¿Cómo usar el Validador JSON?</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pega o escribe tu JSON en el área de texto.</li>
          <li>Haz clic en "Validar" para comprobar la sintaxis.</li>
          <li>Si hay errores, se mostrarán con detalles.</li>
          <li>Puedes formatear el JSON y copiarlo fácilmente.</li>
        </ul>
        <p className="mt-2 text-xs text-gray-400">
          Soporta objetos y arrays anidados, y muestra estadísticas del
          documento.
        </p>
      </div>
    ),
  },
  {
    id: "color-converter",
    title: "Conversor de Color",
    icon: <FaPalette className="text-purple-400" />,
    description: "Convierte entre formatos de color",
    longDescription:
      "Conversor avanzado entre formatos HEX, RGB, HSL y CMYK. Incluye selector de color visual, generación de paletas y vista previa en tiempo real. Perfecto para diseñadores y desarrolladores web.",
    category: "Diseño",
    component: <ColorConverter />,
    examples: [
      "HEX: #4f46e5 → RGB: rgb(79, 70, 229) → HSL: hsl(243, 77%, 59%)",
      "HEX: #ff9800 → RGB: rgb(255, 152, 0) → HSL: hsl(36, 100%, 50%)",
      "HEX: #00b894 → RGB: rgb(0, 184, 148) → HSL: hsl(168, 100%, 36%)",
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Guía rápida del Conversor de Color</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Selecciona o ingresa un color en cualquier formato (HEX, RGB, HSL,
            CMYK).
          </li>
          <li>El resto de los formatos se actualizarán automáticamente.</li>
          <li>Utiliza el selector visual para elegir colores fácilmente.</li>
          <li>Genera paletas y copia los valores con un clic.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "unix-converter",
    title: "Conversor Unix",
    icon: <FaHistory className="text-yellow-400" />,
    description: "Convierte timestamps Unix",
    longDescription:
      "Conversor bidireccional entre timestamp Unix (segundos/milisegundos) y fechas legibles. Soporta múltiples formatos de fecha y diferentes zonas horarias.",
    category: "Utilidades",
    component: <UnixDateConverter />,
    examples: [
      "1672531200 → 01/01/2023 00:00:00 UTC",
      "1689984000000 (ms) → 21/07/2023 00:00:00 UTC",
      "Fecha: 2024-06-01T12:00 → Unix: 1717243200",
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Uso del Conversor Unix</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Convierte entre fechas legibles y timestamps Unix (segundos o
            milisegundos).
          </li>
          <li>Selecciona la zona horaria y formato de salida.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "regex-tester",
    title: "Tester de Regex",
    icon: <FaSearch className="text-red-400" />,
    description: "Prueba expresiones regulares",
    longDescription:
      "Entorno interactivo para probar y depurar expresiones regulares. Resalta coincidencias, muestra grupos de captura y ofrece explicación de patrones. Soporta múltiples modificadores.",
    category: "Desarrollo",
    component: <RegexTester />,
    examples: [
      `Patrón: ^[\\w\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$\nTexto: usuario@dominio.com\n→ Coincide: usuario@dominio.com`,
      `Patrón: (\\d{3})-(\\d{3})-(\\d{4})\nTexto: Tel: 123-456-7890\n→ Grupos: 123, 456, 7890`,
      `Patrón: \\b\\w{5,}\\b\nTexto: Palabras largas: Nebura, herramientas, código\n→ Coincide: Nebura, herramientas`,
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Tester de Expresiones Regulares</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Escribe tu patrón regex y el texto a analizar.</li>
          <li>Las coincidencias y grupos se resaltarán automáticamente.</li>
          <li>
            Consulta la explicación del patrón y prueba diferentes
            modificadores.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "code-playground",
    title: "Playground",
    icon: <FaCode className="text-pink-400" />,
    description: "Ejecuta código JavaScript",
    longDescription:
      "Editor de código interactivo con soporte para JavaScript moderno. Ideal para probar APIs, prototipar ideas o aprender. Incluye autocompletado y consola de salida.",
    category: "Desarrollo",
    component: <CodePlayground />,
    examples: [
      `// Obtener datos de una API\nfetch('https://api.github.com/users/Hiroshi025')\n  .then(r => r.json()).then(console.log);`,
      `// Generar una secuencia\nArray.from({length: 5}, (_, i) => i * 2);`,
      `// Filtrar usuarios activos\nconst users = [{activo:true},{activo:false}];\nusers.filter(u => u.activo);`,
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Playground de Código JavaScript</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Escribe o pega código JavaScript en el editor.</li>
          <li>
            Ejecuta el código y observa la salida en la consola integrada.
          </li>
          <li>Ideal para pruebas rápidas y aprendizaje.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "key-generator",
    title: "Generador Claves",
    icon: <FaKey className="text-teal-400" />,
    description: "Genera claves seguras",
    longDescription:
      "Genera claves API, contraseñas seguras y códigos de licencia. Personaliza longitud, caracteres y formatos. Incluye estimación de fortaleza y opciones de copiado.",
    category: "Seguridad",
    component: <KeyGenerator />,
    examples: [
      `API Key: sk_live_abc123xyz456\n→ Uso: Autenticación en API REST`,
      `Password: Tr0ub4dour&3\n→ Seguridad alta, recomendada para cuentas críticas.`,
      `Licencia: ABCD-EFGH-IJKL-MNOP\n→ Activación de software.`,
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Generador de Claves Seguras</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Elige el tipo de clave: API, contraseña o licencia.</li>
          <li>Personaliza longitud y caracteres.</li>
          <li>Copia la clave generada y revisa su fortaleza.</li>
        </ul>
      </div>
    ),
  },
];

const categories = Array.from(new Set(tools.map((tool) => tool.category)));

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showExamples, setShowExamples] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const notify = useNotification();

  useEffect(() => {
    const handleResize = () => window.innerWidth;
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const displayTools = filteredTools;

  const openTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsFullscreen(false);
  };

  const gridKey = activeCategory + searchQuery;

  const shareOnTwitter = (tool: Tool) => {
    const url =
      typeof window !== "undefined" ? window.location.href + "#" + tool.id : "";
    const text = encodeURIComponent(`¡Prueba la herramienta "${tool.title}"!`);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${text}`,
      "_blank"
    );
  };

  const copyLink = (tool: Tool) => {
    const url =
      typeof window !== "undefined" ? window.location.href + "#" + tool.id : "";
    navigator.clipboard.writeText(url);
    notify?.({ message: "¡Enlace copiado al portapapeles!", type: "success" });
  };

  const downloadTool = (tool: Tool) => {
    notify?.({
      message: `Preparando descarga de ${tool.title}...`,
      type: "info",
    });
  };

  return (
    <div className="min-h-screen relative text-gray-100 overflow-x-hidden">
      {/* Fondo global (imagen + tintado complejo) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/goku-y-shen-long_3840x2160_xtrafondos.com.jpg"
          alt="Fondo herramientas"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-black/60 mix-blend-multiply" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute -left-48 -top-48 w-96 h-96 bg-pink-700/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/8 rounded-full blur-2xl animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        {/* Hero (estilo combinado: principal + minecraft) */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-pink-400/30">
                  {/* logo: reemplaza por Image si tienes un asset */}
                  <span className="text-3xl">🛠️</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600">
                    Herramientas
                  </span>
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                  Colección profesional de utilidades para desarrolladores y
                  diseñadores — validadores, conversores, playgrounds y más.
                </p>

                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow"
                  >
                    Todas
                  </button>
                  <div className="hidden sm:flex gap-2">
                    {categories.slice(0, 4).map((c) => (
                      <button
                        key={c}
                        onClick={() => setActiveCategory(c)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          activeCategory === c
                            ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white"
                            : "bg-gray-800/50 text-gray-200 hover:bg-gray-800/70"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:flex md:flex-col gap-3 items-end">
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    Total herramientas
                  </div>
                  <div className="text-2xl font-bold text-pink-300">
                    {tools.length}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    notify?.({ message: "Filtros reseteados", type: "info" });
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-800/60 border border-pink-700/30 text-pink-300"
                >
                  Reset
                </button>
              </div>
            </motion.div>

            {/* BARRA DE BÚSQUEDA (mejorada) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 relative max-w-3xl mx-auto"
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                <input
                  type="text"
                  placeholder="Buscar herramientas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/70 border border-pink-700/30 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-lg backdrop-blur-sm"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Grid + filtros laterales: tarjetas más sofisticadas */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* SIDEBAR - categorias + acciones */}
              <aside className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-28 space-y-4">
                  <div className="bg-gray-900/60 border border-pink-700/20 rounded-lg p-4">
                    <h4 className="text-sm text-gray-300 font-semibold mb-3">
                      Categorías
                    </h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setActiveCategory("all")}
                        className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                          activeCategory === "all"
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                            : "text-gray-200 hover:bg-gray-800/60"
                        }`}
                      >
                        Todas
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setActiveCategory(c)}
                          className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                            activeCategory === c
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                              : "text-gray-200 hover:bg-gray-800/60"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-pink-700/20 rounded-lg p-4">
                    <h5 className="text-sm text-gray-300 font-semibold mb-2">
                      Acciones
                    </h5>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() =>
                          notify?.({
                            message: "Compartir en Twitter...",
                            type: "info",
                          })
                        }
                        className="px-3 py-2 rounded-md bg-gray-800/60 text-pink-300"
                      >
                        Compartir
                      </button>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("all");
                          notify?.({
                            message: "Filtros limpiados",
                            type: "success",
                          });
                        }}
                        className="px-3 py-2 rounded-md bg-gray-800/60 text-green-300"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* GRID principal */}
              <div className="lg:col-span-3">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <Card
                        className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/70 to-gray-800/60 shadow-xl backdrop-blur-md h-full"
                        onClick={() => openTool(tool)}
                        style={{ minHeight: 220 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/6 to-purple-900/6 pointer-events-none group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex items-start gap-4 z-10 relative p-4">
                          <div className="p-3 rounded-xl bg-gray-800/80 border border-gray-700/50 shadow">
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">
                              {tool.title}
                            </h3>
                            <p className="text-sm text-gray-300 line-clamp-2">
                              {tool.description}
                            </p>
                            <div className="mt-3 flex gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-800/60 text-gray-200 border border-pink-700/20">
                                {tool.category}
                              </span>
                              {tool.examples?.length ? (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-800/60 text-yellow-300 border border-yellow-700/20">
                                  Ejemplos
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="z-10 relative p-4">
                          <div className="text-sm text-gray-300 mb-4 min-h-[56px]">
                            {/* descripción extendida si hace falta */}
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
                              onClick={() => openTool(tool)}
                            >
                              Abrir
                            </button>
                            <button
                              className="px-3 py-2 rounded-md bg-gray-800/60 border border-gray-700/40 text-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyLink(tool);
                              }}
                            >
                              Copiar enlace
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {displayTools.length === 0 && (
                    <div className="col-span-full text-center py-16 text-gray-400">
                      No hay herramientas que coincidan.
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Mantener Dialog / AnimatePresence / Footer intactos */}
        <AnimatePresence>
          {selectedTool && (
            <Dialog
              open={!!selectedTool}
              onOpenChange={(open) => {
                setShowExamples(false);
                setShowHelp(false);
                if (!open) setSelectedTool(null);
              }}
            >
              <m.div
                key={selectedTool.id}
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ duration: 0.25 }}
              >
                <DialogContent
                  className={`bg-gray-800/95 border border-gray-700/50 shadow-2xl rounded-xl transition-all duration-300 ${
                    isFullscreen ? "max-w-full h-screen" : "max-w-4xl"
                  } animate-fadein backdrop-blur-lg`}
                >
                  {selectedTool && (
                    <>
                      <DialogHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gray-800/80 border border-gray-700/50 shadow-lg">
                              {selectedTool.icon}
                            </div>
                            <div>
                              <DialogTitle className="text-2xl font-extrabold text-white tracking-tight">
                                {selectedTool.title}
                              </DialogTitle>
                              <DialogDescription className="text-gray-400 font-medium">
                                {selectedTool.longDescription ||
                                  selectedTool.description}
                              </DialogDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowHelp((v) => !v)}
                              className={`p-2 rounded-lg transition-colors ${
                                showHelp
                                  ? "bg-pink-700/30 text-pink-200"
                                  : "hover:bg-pink-700/20 text-gray-300 hover:text-pink-200"
                              }`}
                              title={
                                showHelp ? "Ocultar ayuda" : "Mostrar ayuda"
                              }
                            >
                              <FaQuestionCircle className="text-xl" />
                            </button>
                            {selectedTool.examples &&
                              selectedTool.examples.length > 0 && (
                                <button
                                  onClick={() => setShowExamples((v) => !v)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    showExamples
                                      ? "bg-purple-700/30 text-yellow-300"
                                      : "hover:bg-purple-700/20 text-gray-300 hover:text-yellow-200"
                                  }`}
                                  title={
                                    showExamples
                                      ? "Ocultar ejemplos"
                                      : "Mostrar ejemplos"
                                  }
                                >
                                  <FaRegLightbulb className="text-xl" />
                                </button>
                              )}
                            <button
                              onClick={() => copyLink(selectedTool)}
                              className="p-2 rounded-lg hover:bg-pink-700/20 transition-colors text-gray-300 hover:text-pink-300"
                              title="Copiar enlace"
                            >
                              <FaCopy />
                            </button>
                            <button
                              onClick={() => shareOnTwitter(selectedTool)}
                              className="p-2 rounded-lg hover:bg-blue-700/20 transition-colors text-gray-300 hover:text-blue-400"
                              title="Compartir en Twitter"
                            >
                              <FaTwitter />
                            </button>
                            <button
                              onClick={() => downloadTool(selectedTool)}
                              className="p-2 rounded-lg hover:bg-green-700/20 transition-colors text-gray-300 hover:text-green-400"
                              title="Descargar"
                            >
                              <FaDownload />
                            </button>
                            <button
                              onClick={() => setIsFullscreen(!isFullscreen)}
                              className="p-2 rounded-lg hover:bg-pink-700/30 transition-colors text-gray-300 hover:text-white"
                              title={
                                isFullscreen
                                  ? "Salir de pantalla completa"
                                  : "Pantalla completa"
                              }
                            >
                              {isFullscreen ? <FaCompress /> : <FaExpand />}
                            </button>
                            <button
                              onClick={() => setSelectedTool(null)}
                              className="p-2 rounded-lg hover:bg-pink-700/30 transition-colors text-gray-300 hover:text-white"
                              title="Cerrar"
                            >
                              <FiX />
                            </button>
                          </div>
                        </div>
                      </DialogHeader>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`${
                          isFullscreen
                            ? "h-[calc(100vh-150px)]"
                            : "max-h-[70vh]"
                        } overflow-y-auto py-2`}
                        style={{
                          scrollbarColor: "#ec4899 #18181b",
                          scrollbarWidth: "thin",
                        }}
                      >
                        {showHelp && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                              <FaQuestionCircle className="text-pink-300" />
                              <span className="font-bold text-pink-200 text-base">
                                Ayuda y Tutorial
                              </span>
                            </div>
                            <div className="bg-gray-900/80 border border-pink-700/30 rounded-lg p-4 space-y-2 text-pink-100 text-sm">
                              {selectedTool.documentation ? (
                                selectedTool.documentation
                              ) : (
                                <>
                                  <p>
                                    {selectedTool.title} es una herramienta
                                    interactiva. Usa los controles y opciones
                                    para experimentar. Consulta la documentación
                                    oficial para más detalles.
                                  </p>
                                  <ul className="list-disc pl-5">
                                    <li>
                                      Usa los ejemplos para aprender rápidamente
                                      cómo funciona.
                                    </li>
                                    <li>
                                      Si tienes dudas, consulta la documentación
                                      o contacta soporte.
                                    </li>
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {showExamples && selectedTool.examples && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                              <FaRegLightbulb className="text-yellow-300" />
                              <span className="font-bold text-yellow-200 text-base">
                                Ejemplos de uso
                              </span>
                            </div>
                            <div className="bg-gray-900/80 border border-yellow-700/30 rounded-lg p-4 space-y-3">
                              {selectedTool.examples.map((ex, i) => (
                                <pre
                                  key={i}
                                  className="bg-gray-800/80 text-yellow-100 rounded p-3 text-xs whitespace-pre-wrap font-mono border border-gray-700/40"
                                >
                                  {ex}
                                </pre>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedTool.component}
                      </motion.div>
                    </>
                  )}
                </DialogContent>
              </m.div>
            </Dialog>
          )}
        </AnimatePresence>

        <footer className="py-10 px-4 border-t border-gray-800/50 bg-gray-900/80 shadow-inner mt-16 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                  <FaTools className="text-pink-400" /> Herramientas
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Colección profesional de herramientas interactivas para
                  creadores
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Hiroshi025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                  title="GitHub"
                >
                  <FaGithub className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                  title="Discord"
                >
                  <SiDiscord className="text-2xl" />
                </a>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Hiroshi025. Todos los derechos
              reservados.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
