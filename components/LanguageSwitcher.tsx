"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/i18n"

interface LanguageSwitcherProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {currentLang.toUpperCase()}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50">
          <div className="py-1">
            <button
              onClick={() => {
                onLanguageChange("es")
                setIsOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLang === "es" ? "bg-purple-900/50 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Español
            </button>
            <button
              onClick={() => {
                onLanguageChange("en")
                setIsOpen(false)
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLang === "en" ? "bg-purple-900/50 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
