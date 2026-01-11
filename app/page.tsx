"use client";

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  Briefcase,
  Code,
  GraduationCap,
  Pause,
  Play,
  Rocket,
  X,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPython, FaReact } from "react-icons/fa";
import { FiAward, FiCode, FiGithub, FiLinkedin, FiUser } from "react-icons/fi";
import { SiCplusplus, SiDiscord, SiNestjs, SiTypescript } from "react-icons/si";
import { useInView } from "react-intersection-observer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  NotificationProvider,
  useNotification,
} from "../components/tools/NotificationContext";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: { name: string } | null;
  homepage: string | null;
  owner: { login: string; avatar_url: string };
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics?: string[];
  contributors_url: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  stars?: number; // Nuevo campo opcional
}

interface RepoDetails extends Repo {
  contributors?: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
  }>;
  languages?: Record<string, number>;
}

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
}

const experiences = [
  {
    id: 1,
    year: "2025",
    title: "Desarrollador Full Stack",
    company: "Autónomo/Freelance",
    description:
      "Desarrollo de aplicaciones web completas, bots para múltiples plataformas (Discord, Telegram, WhatsApp), monitores de precios y stocks, y herramientas de seguridad. Especialización en arquitecturas escalables y buenas prácticas de código.",
    icon: <Code className="text-pink-400" size={24} />,
    tags: ["React", "TypeScript", "NestJS", "C++", "Bots"],
  },
  {
    id: 2,
    year: "2022 - 2023",
    title: "Contribuidor Open Source",
    company: "Proyectos GitHub",
    description:
      "Contribuciones significativas a proyectos de código abierto, mejorando documentación, resolviendo issues y añadiendo nuevas funcionalidades.",
    icon: <Rocket className="text-purple-500" size={24} />,
    tags: ["Open Source", "Git", "Comunidad"],
  },
  {
    id: 3,
    year: "2021 - 2022",
    title: "Desarrollo de Software",
    company: "Proyectos Personales",
    description:
      "Creación de bots para diversas plataformas (Discord, Telegram, WhatsApp), monitores de precios y stocks en tiempo real, programas en C++ para automatización, diseño de interfaces modernas y herramientas de seguridad y hacking ético.",
    icon: <GraduationCap className="text-violet-400" size={24} />,
    tags: ["Bots", "Monitores", "Hacking", "C++", "Diseño"],
  },
  {
    id: 4,
    year: "2020 - 2021",
    title: "Primeros Proyectos",
    company: "Aprendizaje Autodidacta",
    description:
      "Exploración de tecnologías web mediante la creación de proyectos personales y pequeños trabajos freelance.",
    icon: <Briefcase className="text-blue-400" size={24} />,
    tags: ["JavaScript", "Python", "Web Development"],
  },
];

const PortfolioPage = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedRepo, setSelectedRepo] = useState<RepoDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    languages: {},
  });

  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const technologies = [
    { name: "React", icon: <FaReact className="text-cyan-400" />, level: 85 },
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-blue-500" />,
      level: 80,
    },
    {
      name: "C++",
      icon: <SiCplusplus className="text-blue-400" />,
      level: 75,
    },
    {
      name: "Python",
      icon: <FaPython className="text-yellow-300" />,
      level: 70,
    },
    {
      name: "NestJS",
      icon: <SiNestjs className="text-red-500" />,
      level: 75,
    },
    { name: "CSS3", icon: <FiCode className="text-pink-400" />, level: 85 },
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  // Nuevo estado para el índice del testimonio actual
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Añadir estado para controlar qué testimonios están expandidos
  const [expandedTestimonials, setExpandedTestimonials] = useState<{
    [id: number]: boolean;
  }>({});

  // Función para alternar la expansión de un testimonio
  const toggleExpandTestimonial = (id: number) => {
    setExpandedTestimonials((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calcula cuántos testimonios mostrar por página
  const testimonialsPerPage = 2;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/data/comments.json");
        if (!res.ok) throw new Error("No se pudo cargar comments.json");
        const data: Testimonial[] = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Error cargando testimonios:", err);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/Hiroshi025/repos?per_page=100"
        );
        const data: Repo[] = await response.json();
        setRepos(data);

        // Calculate stats
        const stats: GitHubStats = {
          totalRepos: data.length,
          totalStars: data.reduce(
            (acc, repo) => acc + repo.stargazers_count,
            0
          ),
          totalForks: data.reduce((acc, repo) => acc + repo.forks_count, 0),
          languages: {},
        };

        // Count languages
        data.forEach((repo) => {
          if (repo.language) {
            stats.languages[repo.language] =
              (stats.languages[repo.language] || 0) + 1;
          }
        });

        setGithubStats(stats);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
    }));
    setParticles(newParticles);
  }, [isPlaying]);

  const fetchRepoDetails = async (repo: Repo) => {
    setLoadingDetails(true);
    setSelectedRepo({ ...repo });

    try {
      // Fetch contributors
      const contributorsRes = await fetch(
        `${repo.contributors_url}?per_page=10`
      );
      const contributors = await contributorsRes.json();

      // Fetch languages
      const languagesRes = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`
      );
      const languages = await languagesRes.json();

      setSelectedRepo({
        ...repo,
        contributors: Array.isArray(contributors) ? contributors : [],
        languages,
      });
    } catch (error) {
      console.error("Error fetching repo details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter projects
  const featuredRepos = repos
    .filter((repo) => repo.stargazers_count > 0 || repo.forks_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  const recentRepos = [...repos]
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    )
    .slice(0, 6);

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const StatsSection = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true });

    useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);

    const stats = [
      { label: "Repositorios Públicos", value: githubStats.totalRepos },
      { label: "Stars en GitHub", value: githubStats.totalStars },
      { label: "Forks Totales", value: githubStats.totalForks },
      {
        label: "Tecnologías Dominadas",
        value: Object.keys(githubStats.languages).length,
      },
    ];

    return (
      <section className="py-20 px-4 bg-black/50 from-gray-900 via-purple-950/50 to-black">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.2 } },
                }}
                className="flex flex-col items-center"
              >
                <motion.span
                  initial={{ textShadow: "0 0 0px #ec4899" }}
                  animate={{ textShadow: "0 0 16px #ec4899" }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    duration: 1.5,
                  }}
                  className="text-4xl md:text-5xl font-bold text-pink-400"
                >
                  <AnimatedCounter to={stat.value} />
                </motion.span>
                <span className="text-gray-300 mt-2 text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Animated counter
  const AnimatedCounter = ({ to }: { to: number }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
      const start = 0;
      const end = to;
      if (start === end) return;
      let current = start;
      const increment = end > start ? 1 : -1;
      const timer = setInterval(() => {
        current += increment;
        setCount(current);
        if (current === end) clearInterval(timer);
      }, 30);
      return () => clearInterval(timer);
    }, [to]);

    return <span ref={ref}>{count}</span>;
  };

  function ToolButtons() {
    const notify = useNotification();

    const handleCopy = async () => {
      try {
        // ...lógica de copiado...
        notify({ message: "¡Copiado al portapapeles!", type: "success" });
      } catch {
        notify({ message: "Error al copiar.", type: "error" });
      }
    };

    const handleDownload = () => {
      // ...lógica de descarga...
      notify({ message: "Descarga iniciada.", type: "info" });
    };

    const handleConvert = () => {
      // ...lógica de conversión...
      notify({ message: "Conversión completada.", type: "success" });
    };

    return (
      <div>
        <button onClick={handleCopy}>Copiar</button>
        <button onClick={handleDownload}>Descargar</button>
        <button onClick={handleConvert}>Convertir</button>
      </div>
    );
  }

  // Manejo de navegación de testimonios
  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };
  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev >= totalPages - 1 ? prev : prev + 1));
  };
  const goToTestimonial = (idx: number) => {
    setTestimonialIndex(idx);
  };

  // Navegación con teclado
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevTestimonial();
      if (e.key === "ArrowRight") handleNextTestimonial();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line
  }, [testimonials, testimonialIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-gray-900 text-gray-100">
      <Head>
        <title>Hiroshi025 | Desarrollador</title>
        <meta
          name="description"
          content="Portafolio profesional de Hiroshi025, desarrollador backend especializado en Python, C++, NestJS y TypeScript"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-pink-900/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-white">Hiroshi025</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/anime"
              className="text-gray-300 hover:text-pink-400 transition-colors"
            >
              Anime
            </Link>
            <Link
              href="/tools"
              className="text-gray-300 hover:text-pink-400 transition-colors"
            >
              Herramientas
            </Link>
            <Link
              href="/minecraft"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Minecraft
            </Link>
            <Link
              href="#experience"
              className="text-gray-300 hover:text-pink-400 transition-colors"
            >
              Experiencia
            </Link>
          </div>

          <Button variant="ghost" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      </nav>

      <section className="relative py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <Image
              src="https://i.pinimg.com/736x/b2/70/da/b270da97c173200915aebf417cb9b52a.jpg"
              alt="Background anime"
              fill
              className="object-cover object-center"
              quality={90}
              priority
            />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute bg-pink-400 rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Hiroshi025
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-8">
              Desarrollador | Backend y Microcontroladores
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Creo soluciones digitales innovadoras con tecnologías modernas y
              código limpio.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/20"
                size="lg"
              >
                <Link href="#projects">Ver mis proyectos</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-pink-400 text-pink-400 hover:bg-pink-900/50 hover:text-white shadow-lg shadow-pink-500/10 bg-transparent"
                size="lg"
              >
                <Link href="#contact">Contacto</Link>
              </Button>
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-900/50 hover:text-white shadow-lg shadow-purple-500/10 bg-transparent"
                size="lg"
              >
                {isPlaying ? (
                  <Pause className="mr-2" />
                ) : (
                  <Play className="mr-2" />
                )}
                Animación
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="about"
        className="py-20 px-4 bg-black/50 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-pink-500/30 shadow-xl">
                <Image
                  src="https://i.pinimg.com/736x/99/3c/85/993c852d1a92514a8feca6ec7d71f0a2.jpg"
                  alt="Foto de Hiroshi025"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20"></div>
              </div>
            </div>

            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                  Sobre Mí
                </span>
              </h2>

              <p className="text-gray-300 mb-6 text-lg">
                Soy un desarrollador backend con más de 3 años de experiencia
                creando aplicaciones web modernas. Me especializo en C++,
                TypeScript y el ecosistema React/NestJS.
              </p>

              <p className="text-gray-400 mb-8">
                Mi pasión por la programación comenzó cuando descubrí cómo crear
                mis propias soluciones tecnológicas. Desde entonces, he
                trabajado en diversos proyectos, desde pequeñas aplicaciones
                hasta sistemas complejos, siempre buscando aprender y mejorar
                mis habilidades.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-pink-700/30">
                  <FiUser className="text-pink-400" />
                  <span>Backend Developer</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-pink-700/30">
                  <FiCode className="text-pink-400" />
                  <span>+20 Proyectos</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-pink-700/30">
                  <FiAward className="text-pink-400" />
                  <span>Open Source Contributor</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <StatsSection />

      {/* Skills */}
      <section id="skills" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Mis Habilidades
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-6">
                  Tecnologías Principales
                </h3>
                <div className="space-y-6">
                  {technologies.map((tech, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {tech.icon}
                          <span className="text-gray-300">{tech.name}</span>
                        </div>
                        <span className="text-gray-400">{tech.level}%</span>
                      </div>
                      <Progress
                        value={tech.level}
                        className="h-2 bg-gray-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-6">
                  Otras Tecnologías
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Bootstrap",
                    "Tailwind CSS",
                    "Next.js",
                    "GraphQL",
                    "PostgreSQL",
                    "Docker",
                    "Git",
                    "Jest",
                    "Redux",
                    "AWS",
                    "Firebase",
                    "REST APIs",
                  ].map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-800/50 hover:bg-gray-700/50 border border-pink-700/30 text-gray-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-gray-300 mt-8 mb-4">
                  Idiomas
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Español</span>
                      <span className="text-gray-400">Nativo</span>
                    </div>
                    <Progress value={100} className="h-2 bg-gray-800" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Inglés</span>
                      <span className="text-gray-400">Básico (A2)</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="featured"
        className="py-20 px-4 bg-gradient-to-br from-purple-950/50 via-black to-gray-900 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Proyectos Principales
              </span>
            </h2>
            <div className="bg-gray-800/60 rounded-xl p-16 border border-pink-700/30">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-pink-300 mb-4">
                Próximamente
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Estoy trabajando en proyectos increíbles que pronto estarán
                disponibles aquí. Mantente atento para ver las últimas
                innovaciones y desarrollos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="projects"
        className="py-20 px-4 bg-black/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid-dark.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Mis Proyectos
              </span>
            </h2>

            {/* GitHub Language Distribution */}
            <div className="mb-12 bg-gray-800/60 rounded-xl p-6 border border-pink-700/30">
              <h3 className="text-xl font-semibold mb-4 text-pink-300">
                Distribución de Lenguajes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(githubStats.languages)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([lang, count]) => (
                    <div
                      key={lang}
                      className="bg-gray-900/50 p-4 rounded-lg border border-purple-700/20 text-center"
                    >
                      <div className="text-2xl font-bold text-pink-400">
                        {count}
                      </div>
                      <div className="text-sm text-gray-400">{lang}</div>
                    </div>
                  ))}
              </div>
            </div>

            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto bg-gray-800 border border-pink-700/30">
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-pink-900/50 data-[state=active]:text-pink-300"
                >
                  Destacados
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-pink-900/50 data-[state=active]:text-pink-300"
                >
                  Recientes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="featured">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-pink-700/30 h-64 animate-pulse rounded-xl"
                      ></Card>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {featuredRepos.map((repo) => (
                      <motion.div key={repo.id} variants={item}>
                        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-pink-700/30 hover:border-pink-500/70 transition-all hover:shadow-lg hover:shadow-pink-500/20 h-full flex flex-col rounded-xl group">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl text-white font-bold group-hover:text-pink-400 transition-colors">
                                {repo.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-xs border border-pink-700 text-pink-300 bg-gray-800/70 group-hover:bg-pink-900/30 transition-colors"
                              >
                                {repo.language || "Multi"}
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-300 line-clamp-2">
                              {repo.description || "Sin descripción disponible"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="text-yellow-400"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                <span>{repo.stargazers_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="18" r="3"></circle>
                                  <circle cx="6" cy="6" r="3"></circle>
                                  <circle cx="18" cy="6" r="3"></circle>
                                  <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path>
                                  <path d="M12 12v3"></path>
                                </svg>
                                <span>{repo.forks_count}</span>
                              </div>
                            </div>
                            {repo.topics && repo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {repo.topics.slice(0, 3).map((topic, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-gray-800/50 border-pink-700/30 text-pink-300"
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex gap-2">
                            <Button
                              onClick={() => fetchRepoDetails(repo)}
                              variant="outline"
                              className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg font-semibold group-hover:shadow-purple-500/20 transition-all bg-transparent"
                            >
                              Ver Detalles
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="flex-1 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white rounded-lg font-semibold group-hover:shadow-pink-500/20 transition-all bg-transparent"
                            >
                              <Link href={repo.html_url} target="_blank">
                                <FiGithub className="mr-2" /> GitHub
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-pink-700/30 h-64 animate-pulse rounded-xl"
                      ></Card>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {recentRepos.map((repo) => (
                      <motion.div key={repo.id} variants={item}>
                        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-pink-700/30 hover:border-pink-500/70 transition-all hover:shadow-lg hover:shadow-pink-500/20 h-full flex flex-col rounded-xl group">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl text-white font-bold group-hover:text-pink-400 transition-colors">
                                {repo.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-xs border border-pink-700 text-pink-300 bg-gray-800/70 group-hover:bg-pink-900/30 transition-colors"
                              >
                                {repo.language || "Multi"}
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-300 line-clamp-2">
                              {repo.description || "Sin descripción disponible"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                              <span>
                                Actualizado:{" "}
                                {new Date(repo.pushed_at).toLocaleDateString()}
                              </span>
                            </div>
                            {repo.topics && repo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {repo.topics.slice(0, 3).map((topic, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-gray-800/50 border-pink-700/30 text-pink-300"
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex gap-2">
                            <Button
                              onClick={() => fetchRepoDetails(repo)}
                              variant="outline"
                              className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg font-semibold group-hover:shadow-purple-500/20 transition-all bg-transparent"
                            >
                              Ver Detalles
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="flex-1 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white rounded-lg font-semibold group-hover:shadow-pink-500/20 transition-all bg-transparent"
                            >
                              <Link href={repo.html_url} target="_blank">
                                <FiGithub className="mr-2" /> GitHub
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {selectedRepo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-pink-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
          >
            <button
              onClick={() => setSelectedRepo(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={selectedRepo.owner.avatar_url || "/placeholder.svg"}
                  alt={selectedRepo.owner.login}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-pink-500/50"
                />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedRepo.name}
                  </h2>
                  <p className="text-gray-400">by {selectedRepo.owner.login}</p>
                </div>
              </div>

              <p className="text-gray-300 text-lg mb-6">
                {selectedRepo.description || "Sin descripción disponible"}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/30 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedRepo.stargazers_count}
                  </div>
                  <div className="text-sm text-gray-400">Stars</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/30 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedRepo.forks_count}
                  </div>
                  <div className="text-sm text-gray-400">Forks</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/30 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedRepo.watchers_count}
                  </div>
                  <div className="text-sm text-gray-400">Watchers</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/30 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {selectedRepo.open_issues_count}
                  </div>
                  <div className="text-sm text-gray-400">Issues</div>
                </div>
              </div>

              {/* Languages */}
              {selectedRepo.languages &&
                Object.keys(selectedRepo.languages).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-pink-300 mb-3">
                      Tecnologías Utilizadas
                    </h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-pink-700/30">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(selectedRepo.languages).map(
                          ([lang, bytes]) => (
                            <Badge
                              key={lang}
                              variant="outline"
                              className="bg-purple-900/30 border-purple-500/50 text-purple-200 px-3 py-1"
                            >
                              {lang}
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                        {Object.entries(selectedRepo.languages).map(
                          ([lang, bytes], idx) => {
                            const total = Object.values(
                              selectedRepo.languages!
                            ).reduce((a, b) => a + b, 0);
                            const percentage = ((bytes / total) * 100).toFixed(
                              1
                            );
                            const colors = [
                              "bg-blue-500",
                              "bg-yellow-500",
                              "bg-green-500",
                              "bg-red-500",
                              "bg-purple-500",
                            ];
                            return (
                              <div
                                key={lang}
                                className={`${
                                  colors[idx % colors.length]
                                } transition-all`}
                                style={{ width: `${percentage}%` }}
                                title={`${lang}: ${percentage}%`}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Contributors */}
              {selectedRepo.contributors &&
                selectedRepo.contributors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-pink-300 mb-3">
                      Colaboradores
                    </h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-pink-700/30">
                      <div className="flex flex-wrap gap-4">
                        {selectedRepo.contributors
                          .slice(0, 10)
                          .map((contributor) => (
                            <div
                              key={contributor.login}
                              className="flex flex-col items-center"
                            >
                              <Image
                                src={
                                  contributor.avatar_url || "/placeholder.svg"
                                }
                                alt={contributor.login}
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-purple-500/50 mb-2"
                              />
                              <span className="text-xs text-gray-400">
                                {contributor.login}
                              </span>
                              <span className="text-xs text-pink-400">
                                {contributor.contributions} commits
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Dates and License */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/30">
                  <div className="text-sm text-gray-400 mb-1">Creado</div>
                  <div className="text-white">
                    {new Date(selectedRepo.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/30">
                  <div className="text-sm text-gray-400 mb-1">
                    Última actualización
                  </div>
                  <div className="text-white">
                    {new Date(selectedRepo.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {selectedRepo.license && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-green-700/30 mb-6">
                  <div className="text-sm text-gray-400 mb-1">Licencia</div>
                  <div className="text-green-400 font-semibold">
                    {selectedRepo.license.name}
                  </div>
                </div>
              )}

              {/* Topics */}
              {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-pink-300 mb-3">
                    Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRepo.topics.map((topic, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-pink-900/30 border-pink-500/50 text-pink-200 px-3 py-1"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Link href={selectedRepo.html_url} target="_blank">
                    <FiGithub className="mr-2" /> Ver en GitHub
                  </Link>
                </Button>
                {selectedRepo.homepage && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                  >
                    <Link href={selectedRepo.homepage} target="_blank">
                      🌐 Sitio Web
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Experience */}
      <section
        id="experience"
        className="py-20 px-4 bg-black/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Trayectoria Profesional
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Mi camino en el desarrollo de software, desde los primeros pasos
              hasta los proyectos más complejos.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 hidden md:block h-full w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-transparent transform -translate-x-1/2 rounded-full"></div>

            <div className="space-y-12 md:space-y-0">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                  {/* Mobile */}
                  <div className="md:hidden w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-lg p-6 border border-pink-700/30 hover:border-pink-500/50 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg border-2 border-pink-400">
                        {exp.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-pink-400">
                          {exp.company} • {exp.year}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-full bg-gray-800/70 text-pink-300 border border-pink-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:flex md:w-1/2 flex-col items-end pr-12 text-right">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-pink-700/30 p-6 shadow-lg w-full max-w-lg hover:border-pink-500/50 transition-colors">
                      <h3 className="text-2xl font-bold text-white">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-pink-400 mb-2">
                        {exp.company}
                      </p>
                      <p className="text-gray-300 mb-4">{exp.description}</p>
                      <div className="flex flex-wrap justify-end gap-2">
                        {exp.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full bg-gray-800/70 text-pink-300 border border-pink-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-4 border-pink-400 items-center justify-center shadow-xl z-10 hover:shadow-pink-500/30 transition-shadow">
                    {exp.icon}
                  </div>

                  <div className="hidden md:flex md:w-1/2 pl-12 items-center">
                    <div className="text-left">
                      <p className="text-xl font-semibold text-pink-300">
                        {exp.year}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="py-20 px-4 bg-black/50 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Testimonios
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Opiniones de personas que han trabajado conmigo o han visto mi
              trabajo.
            </p>
          </motion.div>

          {loadingTestimonials ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-pink-700/30 animate-pulse"
                />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div
              className="flex flex-col items-center"
              tabIndex={0}
              aria-label="Carrusel de testimonios"
            >
              <div className="relative w-full max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {testimonials
                      .slice(
                        testimonialIndex * testimonialsPerPage,
                        testimonialIndex * testimonialsPerPage +
                          testimonialsPerPage
                      )
                      .map((t) => {
                        // Límite de caracteres para mostrar antes de recortar
                        const MAX_LENGTH = 260;
                        const isLong = t.comment.length > MAX_LENGTH;
                        const expanded = expandedTestimonials[t.id] ?? false;
                        const displayComment =
                          isLong && !expanded
                            ? t.comment.slice(0, MAX_LENGTH) + "..."
                            : t.comment;

                        return (
                          <div
                            key={t.id}
                            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-pink-700/30 flex flex-col h-full"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-pink-500/40">
                                <Image
                                  src={t.avatar}
                                  alt={t.name}
                                  width={56}
                                  height={56}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-white font-semibold">
                                      {t.name}
                                    </div>
                                    <div className="text-sm text-pink-300">
                                      {t.role}
                                    </div>
                                  </div>
                                  {/* Indicador de estrellas */}
                                  {typeof t.stars === "number" &&
                                    t.stars > 0 && (
                                      <div className="flex items-center ml-2">
                                        {[...Array(5)].map((_, i) => (
                                          <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < (t.stars ?? 0)
                                                ? "text-yellow-400"
                                                : "text-gray-600"
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <polygon points="10 1.5 12.59 7.36 18.9 7.64 13.97 11.97 15.18 18.13 10 14.77 4.82 18.13 6.03 11.97 1.1 7.64 7.41 7.36 10 1.5" />
                                          </svg>
                                        ))}
                                      </div>
                                    )}
                                </div>
                                <p className="text-gray-300 mt-4 text-sm relative">
                                  {displayComment}
                                  {isLong && (
                                    <button
                                      className="ml-2 text-pink-400 underline text-xs font-semibold hover:text-pink-300 transition-colors"
                                      onClick={() =>
                                        toggleExpandTestimonial(t.id)
                                      }
                                    >
                                      {expanded ? "Ver menos" : "Ver más"}
                                    </button>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </motion.div>
                </AnimatePresence>
                {/* Controles de navegación */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrevTestimonial}
                    className={`p-2 rounded-full border transition-colors ${
                      testimonialIndex === 0
                        ? "bg-gray-700/60 border-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-800/60 hover:bg-pink-500/40 border-pink-700/30 text-pink-300"
                    }`}
                    aria-label="Anterior"
                    disabled={testimonialIndex === 0}
                    tabIndex={0}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {/* Indicadores de página */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToTestimonial(idx)}
                        className={`w-3 h-3 rounded-full border-2 transition-all duration-200 mx-0.5 ${
                          idx === testimonialIndex
                            ? "bg-pink-400 border-pink-400 scale-110"
                            : "bg-gray-600 border-gray-700 hover:bg-pink-300"
                        }`}
                        aria-label={`Ver página de testimonios ${idx + 1}`}
                        title={
                          idx === 0
                            ? "Primera página"
                            : idx === totalPages - 1
                            ? "Última página"
                            : `Página ${idx + 1}`
                        }
                        tabIndex={0}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNextTestimonial}
                    className={`p-2 rounded-full border transition-colors ${
                      testimonialIndex === totalPages - 1
                        ? "bg-gray-700/60 border-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-800/60 hover:bg-pink-500/40 border-pink-700/30 text-pink-300"
                    }`}
                    aria-label="Siguiente"
                    disabled={testimonialIndex === totalPages - 1}
                    tabIndex={0}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              No hay testimonios disponibles.
            </div>
          )}
        </div>
      </section>

      <section
        id="stack"
        className="py-20 px-4 bg-gradient-to-br from-black via-purple-950/30 to-black relative overflow-hidden"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Mi Stack Favorito
              </span>
            </h2>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex flex-col items-center">
                <FaPython className="text-yellow-300 text-5xl mb-2" />
                <span className="text-gray-300">Python</span>
              </div>
              <div className="flex flex-col items-center">
                <SiCplusplus className="text-blue-400 text-5xl mb-2" />
                <span className="text-gray-300">C++</span>
              </div>
              <div className="flex flex-col items-center">
                <SiTypescript className="text-blue-500 text-5xl mb-2" />
                <span className="text-gray-300">TypeScript</span>
              </div>
              <div className="flex flex-col items-center">
                <SiNestjs className="text-red-500 text-5xl mb-2" />
                <span className="text-gray-300">NestJS</span>
              </div>
            </div>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">
              Mi stack favorito combina la potencia de <b>Python</b> y{" "}
              <b>C++</b> para lógica avanzada y automatización, junto con{" "}
              <b>TypeScript</b> y <b>NestJS</b> para construir APIs robustas y
              escalables con arquitectura modular. Utilizo <b>Prisma</b> como
              ORM moderno para bases de datos, logrando así soluciones
              eficientes, seguras y de alto rendimiento.
            </p>
          </motion.div>
        </div>
      </section>

      <section
        id="contact"
        className="py-20 px-4 bg-black/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://i.pinimg.com/736x/b2/70/da/b270da97c173200915aebf417cb9b52a.jpg"
            alt="Background anime"
            fill
            className="object-cover object-center"
            quality={80}
          />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                Contacto
              </span>
            </h2>

            <p className="text-gray-400 mb-4 max-w-2xl mx-auto">
              ¿Interesado en trabajar juntos o tienes alguna pregunta? No dudes
              en contactarme.
            </p>

            <div className="mb-8 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl p-6 border border-pink-500/30">
              <div className="flex items-center justify-center gap-3 mb-3">
                <SiDiscord className="text-4xl text-pink-400" />
                <h3 className="text-2xl font-bold text-white">
                  Discord - Principal forma de contacto
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Encuéntrame en Discord para una respuesta rápida:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <code className="bg-gray-800/70 px-4 py-2 rounded-lg text-pink-300 font-mono text-lg border border-pink-700/30">
                  alchemistdevs
                </code>
                <span className="text-gray-400">o</span>
                <code className="bg-gray-800/70 px-4 py-2 rounded-lg text-pink-300 font-mono text-lg border border-pink-700/30">
                  _Hiroshi025_
                </code>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <Button
                asChild
                variant="outline"
                className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-lg shadow-pink-500/10 bg-transparent"
              >
                <Link href="mailto:hiroshi@example.com">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4"
                    />
                  </svg>
                  <span className="ml-2">contact@hiroshi-dev.me</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-lg shadow-pink-500/10 bg-transparent"
              >
                <Link
                  href="https://www.linkedin.com/in/hiroshi025"
                  target="_blank"
                >
                  <FiLinkedin className="mr-2" />
                  LinkedIn
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-lg shadow-pink-500/10 bg-transparent"
              >
                <Link href="https://github.com/Hiroshi025" target="_blank">
                  <FiGithub className="mr-2" />
                  GitHub
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-lg shadow-pink-500/10 bg-transparent"
              >
                <a href="/cv-hiroshi025.pdf" download>
                  <svg
                    className="mr-2"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                  Descargar CV
                </a>
              </Button>
            </div>

            <div className="mb-8 flex flex-col items-center">
              <div className="flex items-center gap-2 text-pink-400 font-semibold">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Horario de respuesta:</span>
              </div>
              <span className="text-gray-400 text-sm mt-1">
                Lunes a Viernes, 9:00 - 18:00 (GMT-5)
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default function Page() {
  return (
    <NotificationProvider>
      <PortfolioPage />
    </NotificationProvider>
  );
}
