"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const techs = [
  { name: "Forge", emoji: "🛠️", desc: "Mod loader clásico" },
  { name: "NeoForge", emoji: "⚒️", desc: "Fork moderno de Forge" },
  { name: "Mods", emoji: "🧩", desc: "Modificaciones de gameplay" },
  { name: "Resource Packs", emoji: "🎨", desc: "Texturas y assets" },
  { name: "Server Config", emoji: "⚙️", desc: "Optimización y plugins" },
  { name: "Plugins", emoji: "🔌", desc: "Complementos para servidores" },
];

export default function MinecraftPage() {
  return (
    // Wrapper con imagen de fondo para toda la página
    <div className="min-h-screen relative text-gray-100">
      {/* Imagen de fondo global */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/wallpaper_dungeons_2560x1440.png"
          alt="Fondo Minecraft"
          fill
          className="object-cover"
          priority
        />
        {/* Tintado para mantener legibilidad */}
        <div className="absolute inset-0 bg-green-900/55 mix-blend-multiply" />
      </div>

      {/* Contenido (z-index arriba) */}
      <div className="relative z-10">
        {/* Navbar with Minecraft theme */}
        <nav className="sticky top-0 z-50 bg-green-950/40 backdrop-blur-md border-b border-lime-700/20">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-green-600 rounded-md flex items-center justify-center pixelated">
                <span className="text-white font-bold">⛏</span>
              </div>
              <span
                className="text-xl font-bold text-lime-300"
                style={{ fontFamily: "Press Start 2P, monospace" }}
              >
                Minecraft Projects
              </span>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="border-lime-400 text-lime-400 hover:bg-lime-900/30 bg-transparent"
              >
                Volver al Portfolio
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section - igual background que la principal + logo */}
        <section className="relative py-28 px-4 text-center overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center shadow-2xl border-2 border-lime-300">
                  {/* Si prefieres una imagen, reemplaza el span por <Image src="/logo-pickaxe.png" ... /> */}
                  <span className="text-5xl">⛏️</span>
                </div>

                <h1
                  className="text-5xl md:text-6xl font-bold leading-tight"
                  style={{ fontFamily: "Press Start 2P, monospace" }}
                >
                  <span className="text-lime-300 drop-shadow-[0_0_14px_rgba(132,204,22,0.45)]">
                    Minecraft
                  </span>
                </h1>

                <h2
                  className="text-xl md:text-2xl font-semibold text-green-100/90"
                  style={{ fontFamily: "Press Start 2P, monospace" }}
                >
                  Proyectos de Minecraft
                </h2>

                <p className="max-w-2xl text-green-100/80 mt-4">
                  Plugins, mods, resource packs y configuraciones de servidor.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Tech cards dentro del hero (o justo después) */}
          <div className="mt-12 container mx-auto max-w-6xl px-4">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {techs.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="bg-green-950/40 border border-lime-700/20 rounded-lg p-6 backdrop-blur-sm shadow-lg"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-lime-600/20 flex items-center justify-center text-2xl">
                      {t.emoji}
                    </div>
                    <div>
                      <h3 className="text-lime-300 font-bold">{t.name}</h3>
                      <p className="text-sm text-green-200/90">{t.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-green-950/70 border-lime-700/40 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle
                    className="text-4xl mb-4"
                    style={{ fontFamily: "Press Start 2P, monospace" }}
                  >
                    <span className="text-lime-300">Próximamente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6 pb-12">
                  <div className="text-6xl mb-6">🚧</div>
                  <p className="text-lg text-green-200 max-w-2xl mx-auto leading-relaxed">
                    Estoy trabajando en proyectos increíbles relacionados con
                    Minecraft: plugins, mods, mapas personalizados y
                    herramientas para servidores.
                  </p>
                  <p className="text-green-300/80">
                    Mantente atento para ver las últimas innovaciones y
                    creaciones.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-lime-900/30 rounded-lg p-6 border border-lime-700/30">
                      <div className="text-4xl mb-3">🔌</div>
                      <h3 className="text-lime-300 font-bold mb-2">Plugins</h3>
                      <p className="text-sm text-green-200">
                        Plugins personalizados para servidores
                      </p>
                    </div>
                    <div className="bg-lime-900/30 rounded-lg p-6 border border-lime-700/30">
                      <div className="text-4xl mb-3">🎨</div>
                      <h3 className="text-lime-300 font-bold mb-2">Mods</h3>
                      <p className="text-sm text-green-200">
                        Modificaciones únicas para gameplay
                      </p>
                    </div>
                    <div className="bg-lime-900/30 rounded-lg p-6 border border-lime-700/30">
                      <div className="text-4xl mb-3">🗺️</div>
                      <h3 className="text-lime-300 font-bold mb-2">Mapas</h3>
                      <p className="text-sm text-green-200">
                        Mapas de aventura personalizados
                      </p>
                    </div>
                  </div>

                  <div className="mt-12">
                    <Link href="/">
                      <Button className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold px-8 py-3 text-lg">
                        Volver al Portfolio
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 border-t border-lime-800/50 bg-transparent mt-16">
          <div className="container mx-auto max-w-6xl text-center">
            <p
              className="text-green-300"
              style={{
                fontFamily: "Press Start 2P, monospace",
                fontSize: "0.8rem",
              }}
            >
              © {new Date().getFullYear()} Hiroshi025 - Minecraft Projects
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
