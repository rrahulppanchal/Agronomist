"use client"

import Link from "next/link"
import { Leaf, Home } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

export function Header() {
  const { t } = useLanguage()
  const pathname = usePathname();

  return (

    <header className="bg-white shadow-sm border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-green-600 p-1.5 md:p-2 rounded-lg">
            <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">AgriDiagnose</h1>
          </div>
        </Link>

        {/* Navigation & Actions */}


<div className="flex items-center gap-4">
        <LanguageSelector />
        {pathname != "/landing" &&
          <div className="flex items-center gap-4">
            <Link
              href="/landing"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t.common.backToHome}</span>

              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        }

      </div>
      </div>
    </header>
  )
}
