"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

interface TimelineItemProps {
  experience: {
    id: number
    year: string
    title: string
    company: string
    description: string
    icon: React.ReactNode
    tags: string[]
  }
  index: number
  isEven: boolean
}

export function TimelineItem({ experience, index, isEven }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative flex flex-col md:flex-row items-center md:items-start gap-8 mb-12"
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex md:w-1/2 flex-col items-end pr-12 text-right">
        {isEven && (
          <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl border border-pink-700/30 p-6 shadow-lg w-full max-w-lg hover:border-pink-500/50 hover:shadow-pink-500/20 transition-all duration-300">
            <div className="flex items-center justify-end gap-3 mb-3">
              <div className="flex items-center gap-2 text-pink-400">
                <Calendar className="h-4 w-4" />
                <span className="text-lg font-semibold">{experience.year}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{experience.title}</h3>

            <div className="flex items-center justify-end gap-2 text-pink-400 mb-4">
              <MapPin className="h-4 w-4" />
              <p className="text-lg">{experience.company}</p>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{experience.description}</p>

            <div className="flex flex-wrap justify-end gap-2">
              {experience.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="px-3 py-1 text-xs bg-gradient-to-r from-pink-900/50 to-purple-900/50 text-pink-300 border-pink-700 hover:border-pink-500 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Center Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-4 border-pink-400 items-center justify-center shadow-xl z-10 hover:shadow-pink-500/50 cursor-pointer"
      >
        <div className="flex items-center justify-center">{experience.icon}</div>
      </motion.div>

      <div className="hidden md:flex md:w-1/2 pl-12 items-center">
        {!isEven && (
          <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl border border-pink-700/30 p-6 shadow-lg w-full max-w-lg hover:border-pink-500/50 hover:shadow-pink-500/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 text-pink-400">
                <Calendar className="h-4 w-4" />
                <span className="text-lg font-semibold">{experience.year}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{experience.title}</h3>

            <div className="flex items-center gap-2 text-pink-400 mb-4">
              <MapPin className="h-4 w-4" />
              <p className="text-lg">{experience.company}</p>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{experience.description}</p>

            <div className="flex flex-wrap gap-2">
              {experience.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="px-3 py-1 text-xs bg-gradient-to-r from-pink-900/50 to-purple-900/50 text-pink-300 border-pink-700 hover:border-pink-500 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl shadow-lg p-6 border border-pink-700/30 hover:border-pink-500/50 hover:shadow-pink-500/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg border-2 border-pink-400"
            >
              {experience.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-2 text-pink-400 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">{experience.year}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{experience.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-pink-400 mb-3">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">{experience.company}</p>
          </div>

          <p className="text-gray-300 mb-4">{experience.description}</p>

          <div className="flex flex-wrap gap-2">
            {experience.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="px-3 py-1 text-xs bg-gradient-to-r from-pink-900/50 to-purple-900/50 text-pink-300 border-pink-700"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
