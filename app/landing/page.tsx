"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Zap, TrendingUp, CheckCircle2, ArrowRight, Home } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { Header } from "@/components/header"

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            {t.landing.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 text-pretty">
            {t.landing.heroSubtitle}
          </p>
          <Link href="/diagnosis">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
              {t.landing.startFreeDiagnosis}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden h-96 md:h-[500px] flex items-center justify-center border border-green-200">
          <div className="text-center">
            <Leaf className="w-32 h-32 text-green-600 mx-auto opacity-50" />
            <p className="text-gray-600 mt-4">{t.landing.uploadImageText}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">{t.landing.whyChoose}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.landing.features.instantResults.title}</h3>
              <p className="text-gray-600">
                {t.landing.features.instantResults.desc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.landing.features.expertGuidance.title}</h3>
              <p className="text-gray-600">
                {t.landing.features.expertGuidance.desc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.landing.features.accuracy.title}</h3>
              <p className="text-gray-600">
                {t.landing.features.accuracy.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">{t.landing.howItWorks.title}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step}
                </div>
                {/* @ts-ignore */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.landing.howItWorks.steps[step].title}</h3>
                {/* @ts-ignore */}
                <p className="text-gray-600 text-sm">{t.landing.howItWorks.steps[step].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.landing.cta.title}</h2>
          <p className="text-green-50 text-lg mb-8">
            {t.landing.cta.desc}
          </p>
          <Link href="/diagnosis">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-green-600 px-8 py-6 text-lg font-semibold">
              {t.landing.cta.button}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="w-6 h-6 text-green-400" />
              <span className="text-lg font-semibold text-white">AgriDiagnose</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <LanguageSelector />
            </div>
          </div>
          <p className="text-sm">{t.landing.footer.desc}</p>
          <p className="text-xs text-gray-500 mt-8">{t.landing.footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
