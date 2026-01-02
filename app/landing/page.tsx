"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Zap, TrendingUp, CheckCircle2, ArrowRight, Home, Users, Award, BarChart2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/header"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

export default function LandingPage() {
  const { t } = useLanguage()
  useToast()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
        {/* Decorative blob */}
        <img src="/landing/blob-1.svg" alt="" aria-hidden className="pointer-events-none select-none absolute right-0 top-0 w-80 md:w-[420px] opacity-80 -z-10" />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              {t.landing.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 text-pretty">
              {t.landing.heroSubtitle}
            </p>

            <div className="flex items-center gap-4">
              <Link href="/diagnosis">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                  {t.landing.startFreeDiagnosis}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/diagnosis" className="inline-block text-sm text-green-700 hover:underline">
                Learn more
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Home className="w-5 h-5 text-green-600" />
                <span>Trusted by farmers worldwide</span>
              </div>
              <div className="text-xs text-gray-500">•</div>
              <div className="text-sm text-gray-600">Quick, practical, and reliable</div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden h-96 md:h-[500px] border border-green-200 shadow-lg flex items-center justify-center p-6">
              <img src="/landing/plant-illustration.svg" alt="Plant" className="w-full h-full object-contain float-slow" />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-6 left-4 md:left-12 flex gap-4">
              <div className="bg-white w-36 md:w-44 rounded-xl p-3 shadow-md border border-gray-100 transform hover:-translate-y-1 transition">
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=60&auto=format&fit=crop" alt="sample" className="w-full h-20 object-cover rounded-md mb-2" />
                <div className="text-xs text-gray-600">Healthy leaves</div>
              </div>

              <div className="bg-white w-36 md:w-44 rounded-xl p-3 shadow-md border border-gray-100 transform hover:-translate-y-1 transition">
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=60&auto=format&fit=crop" alt="sample" className="w-full h-20 object-cover rounded-md mb-2" />
                <div className="text-xs text-gray-600">Disease signs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted logos & Metrics */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* <div className="text-center mb-6">
            <p className="text-sm text-gray-500">{t.landing.trustedBy}</p>
            <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
              <img src="/landing/partner-1.svg" alt="AgriCo" className="h-10 grayscale hover:grayscale-0 transition" />
              <img src="/landing/partner-2.svg" alt="FarmNet" className="h-10 grayscale hover:grayscale-0 transition" />
              <img src="/landing/partner-3.svg" alt="CropLab" className="h-10 grayscale hover:grayscale-0 transition" />
              <img src="/landing/partner-4.svg" alt="SoilIQ" className="h-10 grayscale hover:grayscale-0 transition" />
            </div>
          </div> */}

          <div className="bg-white/60 rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center gap-4 justify-center">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">100k+</div>
                  <div className="text-sm text-gray-500">{t.landing.metrics.imagesAnalyzed}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <BarChart2 className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-500">{t.landing.metrics.diagnosisAccuracy}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <Award className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-500">{t.landing.metrics.countriesServed}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t.landing.testimonials.title}</h2>
          <p className="text-gray-600 mb-8">{t.landing.testimonials.desc}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* @ts-ignore */}
            {Object.keys(t.landing.testimonials.items).map((k: any) => {
              // @ts-ignore
              const it = t.landing.testimonials.items[k]
              return (
                <div key={k} className="bg-green-50 rounded-lg p-6 shadow-sm border border-gray-100 text-left">
                  <div className="flex items-start gap-4">
                    <img src={`https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png`} alt="avatar" className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="font-semibold text-gray-900">{it.name}</div>
                      <div className="text-xs text-gray-500">{it.role}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-4 text-sm">{it.quote}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t.landing.faq.title}</h2>
          <div className="max-w-3xl mx-auto">
            {/* @ts-ignore */}
            <Accordion type="single" collapsible>
              {Object.keys(t.landing.faq.items).map((k: any) => {
                // @ts-ignore
                const it = t.landing.faq.items[k]
                return (
                  <AccordionItem key={k} value={String(k)}>
                    <AccordionTrigger>{it.q}</AccordionTrigger>
                    <AccordionContent>{it.a}</AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
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

      {/* Newsletter Signup */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 text-left">
              <h3 className="text-xl font-semibold text-gray-900">{t.landing.newsletter.title}</h3>
              <p className="text-gray-600 text-sm">{t.landing.newsletter.subtitle}</p>
            </div>

            <div className="w-full md:w-auto">
              {/* simple subscription form */}
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={(e) => {
                e.preventDefault()
                const email = (e.target as any).elements.email.value
                if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                  alert('Please enter a valid email address.');
                  return;
                }
                // fake subscription success
                alert('Thanks for subscribing!');
                (e.target as any).reset();
              }} className="flex gap-2">
                <input name="email" type="email" placeholder={t.landing.newsletter.placeholder} className="border border-gray-200 rounded-md px-4 py-3 text-sm w-full md:w-64" />
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-semibold">{t.landing.newsletter.button}</button>
              </form>
            </div>
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
            </div>
          </div>
          <p className="text-sm">{t.landing.footer.desc}</p>
          <p className="text-xs text-gray-500 mt-8">{t.landing.footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
