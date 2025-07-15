"use client";

import { AnimatePresence, m, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
	FaCode, FaCompress, FaCopy, FaDiscord, FaExpand, FaGithub, FaHistory, FaKey, FaLink, FaPalette,
	FaQrcode, FaQuestionCircle, FaRegLightbulb, FaSearch, FaServer, FaTools, FaTwitter
} from "react-icons/fa";
import { FiX } from "react-icons/fi";

import ColorConverter from "@/components/tools/ColorConverter";
import JsonValidator from "@/components/tools/JsonValidator";
import KeyGenerator from "@/components/tools/KeyGenerator";
import { useNotification } from "@/components/tools/NotificationContext";
import { QrGenerator } from "@/components/tools/QrGenerator";
import { RegexTester } from "@/components/tools/RegexTester";
import UnixDateConverter from "@/components/tools/UnixDateConverter";
import { WebhookTester } from "@/components/tools/WebhookTester";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

import { CodePlayground, CommandLiveEditor } from "../docs/Tools";

type Tool = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  component: React.ReactNode;
  examples?: string[];
  longDescription?: string;
  documentation?: React.ReactNode; // <--- NUEVO
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
    id: "qr-generator",
    title: "Generador QR",
    icon: <FaQrcode className="text-green-400" />,
    description: "Genera códigos QR personalizables",
    longDescription:
      "Crea códigos QR para URLs, texto, contactos, WiFi y más. Personaliza colores, añade logos y ajusta el nivel de corrección de errores. Descarga en PNG, SVG o JPEG.",
    category: "Utilidades",
    component: <QrGenerator />,
    examples: [
      "URL: https://github.com/Hiroshi025",
      "Texto: ¡Bienvenido a Nebura Tools!",
      "WiFi: WIFI:T:WPA;S:MiRed;P:contraseña123;;",
      "vCard: BEGIN:VCARD\nFN:Juan Pérez\nTEL:123456789\nEND:VCARD",
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Cómo generar un código QR</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Introduce el texto, URL o información que deseas codificar.</li>
          <li>Personaliza colores, tamaño y agrega un logo si lo deseas.</li>
          <li>Descarga el QR en PNG, SVG o JPEG.</li>
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
    id: "command-editor",
    title: "Editor Comandos",
    icon: <FaServer className="text-orange-400" />,
    description: "Simula comandos de chat",
    longDescription:
      "Simulador interactivo para probar comandos de Discord, Slack o WhatsApp. Visualiza respuestas en tiempo real y depura flujos de conversación complejos.",
    category: "Desarrollo",
    component: <CommandLiveEditor />,
    examples: [
      `/ban @usuario razón: spam\n→ Respuesta: Usuario baneado por spam.`,
      `!play https://youtube.com/watch?v=dQw4w9WgXcQ\n→ Respuesta: Reproduciendo canción.`,
      `/help\n→ Respuesta: Lista de comandos disponibles.`,
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Editor de Comandos de Chat</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Simula comandos de Discord, Slack o WhatsApp.</li>
          <li>Visualiza la respuesta en tiempo real.</li>
          <li>Depura flujos de conversación complejos.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "webhook-tester",
    title: "Tester Webhooks",
    icon: <FaLink className="text-indigo-400" />,
    description: "Prueba endpoints de webhooks",
    longDescription:
      "Herramienta completa para probar webhooks con diferentes métodos HTTP, headers y cuerpos de solicitud. Captura y analiza respuestas en tiempo real.",
    category: "Redes",
    component: <WebhookTester />,
    examples: [
      `POST https://api.ejemplo.com/webhook\nBody: {"evento":"nuevo_usuario","id":42}\n→ Respuesta: 200 OK`,
      `Headers: X-Signature: abc123\n→ Verifica la firma del webhook.`,
      `GET https://api.ejemplo.com/status\n→ Respuesta: {"status":"ok"}`,
    ],
    documentation: (
      <div>
        <h4 className="font-bold mb-2">Tester de Webhooks</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Configura la URL, método, headers y cuerpo de la solicitud.</li>
          <li>Envía la petición y analiza la respuesta recibida.</li>
          <li>Útil para desarrollo y pruebas de APIs.</li>
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
  const [showHelp, setShowHelp] = useState(false); // Para mostrar ayuda/tutorial
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const notify = useNotification();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    setWindowWidth(window.innerWidth);
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

  // Antes:
  // const displayTools = tools;

  // Después:
  const displayTools = filteredTools;

  const openTool = (tool: Tool) => {
    // Elimina la condición de "empty"
    setSelectedTool(tool);
    setIsFullscreen(false);
  };

  // Animación para el grid de herramientas al cambiar de categoría
  const gridKey = activeCategory + searchQuery;

  // Función para compartir en Twitter
  const shareOnTwitter = (tool: Tool) => {
    const url =
      typeof window !== "undefined" ? window.location.href + "#" + tool.id : "";
    const text = encodeURIComponent(
      `¡Prueba la herramienta "${tool.title}" en Nebura!`
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${text}`,
      "_blank"
    );
  };

  // Función para copiar enlace
  const copyLink = (tool: Tool) => {
    const url =
      typeof window !== "undefined" ? window.location.href + "#" + tool.id : "";
    navigator.clipboard.writeText(url);
    notify?.({ message: "¡Enlace copiado al portapapeles!", type: "success" });
  };

  return (
    // Cambia el div raíz para usar flex y asegurar el footer abajo
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 text-gray-200 relative overflow-x-hidden">
      {/* Fondo decorativo animado */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 blur-2xl opacity-60 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-gradient-to-br from-gray-900/90 to-purple-900/60 relative overflow-hidden border-b border-purple-900/30"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')]"></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-600 animate-gradient">
                Nebura Herramientas
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
              Colección profesional de herramientas para desarrolladores,
              diseñadores y creadores
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative max-w-2xl mx-auto"
            >
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Buscar herramientas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/80 border border-purple-700/60 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-2xl transition-all duration-200 backdrop-blur-md placeholder-gray-400"
                style={{ boxShadow: "0 4px 32px 0 #7c3aed22" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12 px-4 relative z-10 flex-1">
        <div className="container mx-auto max-w-6xl">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-8 overflow-x-auto pb-2"
          >
            <div className="flex gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all shadow-md border-2 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700 scale-105"
                    : "bg-gray-800/80 hover:bg-purple-900/30 text-gray-300 border-gray-700/80 hover:border-purple-500/30"
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition-all shadow-md border-2 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700 scale-105"
                      : "bg-gray-800/80 hover:bg-purple-900/30 text-gray-300 border-gray-700/80 hover:border-purple-500/30"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tools Grid con altura mínima para evitar que el footer suba */}
          <AnimatePresence mode="wait">
            <m.div
              key={gridKey}
              initial={{ opacity: 1, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px] z-20" // <-- agrega z-20 aquí
            >
              {displayTools.map((tool, index) => (
                <motion.div
                  key={tool.id || `empty-${index}`}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0 8px 32px 0 rgba(124, 58, 237, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="relative bg-gray-800/60 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 h-full cursor-pointer group shadow-xl backdrop-blur-lg overflow-hidden"
                    onClick={() => openTool(tool)}
                    style={{
                      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                      borderRadius: "1rem",
                      minHeight: "280px",
                    }}
                  >
                    {/* Efecto de gradiente sutil en hover */}
                    <div className="absolute inset-0 bg-transparent group-hover:bg-gradient-to-br group-hover:from-purple-900/10 group-hover:to-pink-900/10 transition-all duration-500 pointer-events-none"></div>

                    <CardHeader className="flex flex-row items-center gap-4 z-10 relative">
                      <div className="p-4 rounded-xl bg-gray-800/80 group-hover:bg-purple-900/60 transition-all shadow-lg border border-gray-700/50 group-hover:border-purple-500/30">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors tracking-tight">
                          {tool.title}
                        </h3>
                        <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-gray-800/80 group-hover:bg-purple-900/60 text-white shadow border border-gray-700/50 group-hover:border-purple-500/30 transition-all">
                          {tool.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                      <p className="text-gray-300 font-medium min-h-[48px] mb-4">
                        {tool.description}
                      </p>
                      <button
                        className="mt-4 px-5 py-2 bg-gradient-to-r from-purple-700/80 to-pink-700/80 text-white rounded-lg hover:from-pink-700/80 hover:to-purple-700/80 transition-all text-base font-bold shadow-lg w-full border border-purple-500/30 hover:border-pink-500/30"
                        tabIndex={-1}
                      >
                        Abrir herramienta
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredTools.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-16"
                >
                  <div className="text-gray-500 text-lg font-semibold">
                    No se encontraron herramientas que coincidan con tu búsqueda
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-6 px-8 py-3 bg-gray-800/80 hover:bg-purple-900/60 text-gray-200 rounded-lg transition-all font-bold shadow border border-gray-700/50 hover:border-purple-500/30"
                  >
                    Limpiar filtros
                  </button>
                </motion.div>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Tool Dialog con animación de transición */}
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
                style={{
                  boxShadow: "0 12px 48px 0 rgba(0, 0, 0, 0.3)",
                  minHeight: isFullscreen ? "100vh" : undefined,
                }}
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
                          {/* Botón ayuda/tutorial */}
                          <button
                            onClick={() => setShowHelp((v) => !v)}
                            className={`p-2 rounded-lg transition-colors ${
                              showHelp
                                ? "bg-blue-700/30 text-blue-200"
                                : "hover:bg-blue-700/20 text-gray-300 hover:text-blue-200"
                            }`}
                            title={showHelp ? "Ocultar ayuda" : "Mostrar ayuda"}
                          >
                            <FaQuestionCircle className="text-xl" />
                          </button>
                          {/* Botón ejemplos */}
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
                          {/* Botón copiar enlace */}
                          <button
                            onClick={() => copyLink(selectedTool)}
                            className="p-2 rounded-lg hover:bg-purple-700/20 transition-colors text-gray-300 hover:text-purple-300"
                            title="Copiar enlace"
                          >
                            <FaCopy />
                          </button>
                          {/* Botón compartir Twitter */}
                          <button
                            onClick={() => shareOnTwitter(selectedTool)}
                            className="p-2 rounded-lg hover:bg-blue-700/20 transition-colors text-gray-300 hover:text-blue-400"
                            title="Compartir en Twitter"
                          >
                            <FaTwitter />
                          </button>
                          {/* Botón pantalla completa */}
                          <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 rounded-lg hover:bg-purple-700/30 transition-colors text-gray-300 hover:text-white"
                            title={
                              isFullscreen
                                ? "Salir de pantalla completa"
                                : "Pantalla completa"
                            }
                          >
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                          </button>
                          {/* Botón cerrar */}
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
                        isFullscreen ? "h-[calc(100vh-150px)]" : "max-h-[70vh]"
                      } overflow-y-auto py-2`}
                      style={{
                        scrollbarColor: "#a78bfa #18181b",
                        scrollbarWidth: "thin",
                      }}
                    >
                      {/* Sección ayuda/tutorial */}
                      {showHelp && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <FaQuestionCircle className="text-blue-300" />
                            <span className="font-bold text-blue-200 text-base">
                              Ayuda y Tutorial
                            </span>
                          </div>
                          <div className="bg-gray-900/80 border border-blue-700/30 rounded-lg p-4 space-y-2 text-blue-100 text-sm">
                            {/* Aquí puedes personalizar el tutorial de cada herramienta */}
                            {selectedTool.documentation ? (
                              selectedTool.documentation
                            ) : (
                              <>
                                <p>
                                  {selectedTool.title} es una herramienta
                                  interactiva. Usa los controles y opciones para
                                  experimentar. Consulta la documentación
                                  oficial para más detalles.
                                </p>
                                <ul className="list-disc pl-5">
                                  <li>
                                    Usa los ejemplos para aprender rápidamente
                                    cómo funciona.
                                  </li>
                                  <li>
                                    Si tienes dudas, consulta la documentación o
                                    contacta soporte.
                                  </li>
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Sección ejemplos */}
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
                      {/* Componente herramienta */}
                      {selectedTool.component}
                    </motion.div>
                  </>
                )}
              </DialogContent>
            </m.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-800/50 bg-gray-900/80 shadow-inner mt-16 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                <FaTools className="text-purple-400" /> Herramientas
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
                className="text-gray-400 hover:text-purple-400 transition-colors"
                title="GitHub"
              >
                <FaGithub className="text-2xl" />
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                title="Discord"
              >
                <FaDiscord className="text-2xl" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nebura. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>

      {/* PWA: Para habilitar PWA, agrega un manifest.json y un service worker en la raíz del proyecto.
          Ejemplo: public/manifest.json y registra el service worker en _app.tsx o layout.tsx */}
    </div>
  );
}