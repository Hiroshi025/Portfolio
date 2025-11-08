"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FiGithub, FiStar, FiGitBranch, FiEye, FiAlertCircle } from "react-icons/fi"
import { ExternalLink, Code2, Calendar } from "lucide-react"

interface ProjectCardProps {
  repo: any
  onClick: () => void
  translations: any
}

export function ProjectCard({ repo, onClick, translations }: ProjectCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-pink-700/30 hover:border-pink-500/70 transition-all hover:shadow-lg hover:shadow-pink-500/20 h-full flex flex-col rounded-xl group cursor-pointer overflow-hidden">
        {/* Header con gradiente animado */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_100%] animate-gradient" />

        <CardHeader className="relative">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl text-white font-bold group-hover:text-pink-400 transition-colors flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                {repo.name}
              </CardTitle>
              <CardDescription className="text-gray-300 line-clamp-2 mt-2">
                {repo.description || translations.projects.details.noDescription || "Sin descripción disponible"}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs border border-pink-700 text-pink-300 bg-gray-800/70 group-hover:bg-pink-900/30 transition-colors"
            >
              {repo.language || "Multi"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          {/* Estadísticas con iconos mejorados */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm bg-gray-900/40 rounded-lg p-2">
              <FiStar className="text-yellow-400" />
              <span className="text-gray-300">{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-900/40 rounded-lg p-2">
              <FiGitBranch className="text-blue-400" />
              <span className="text-gray-300">{repo.forks_count}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-900/40 rounded-lg p-2">
              <FiEye className="text-green-400" />
              <span className="text-gray-300">{repo.watchers_count}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-900/40 rounded-lg p-2">
              <FiAlertCircle className="text-red-400" />
              <span className="text-gray-300">{repo.open_issues_count}</span>
            </div>
          </div>

          {/* Topics con mejor diseño */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {repo.topics.slice(0, 3).map((topic: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs bg-purple-900/30 border-purple-500/50 text-purple-200"
                >
                  #{topic}
                </Badge>
              ))}
              {repo.topics.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700 text-gray-400">
                  +{repo.topics.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
              {repo.license && (
                <div className="flex items-center gap-1">
                  <span>{repo.license.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-4">
          <Button
            onClick={onClick}
            variant="outline"
            className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg font-semibold group-hover:shadow-purple-500/20 transition-all bg-transparent"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {translations.projects.actions.viewDetails}
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white rounded-lg font-semibold group-hover:shadow-pink-500/20 transition-all bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <FiGithub className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
