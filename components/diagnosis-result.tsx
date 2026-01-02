"use client"

import { useState, useRef } from "react"
import { AlertCircle, CheckCircle, MessageSquare, ArrowLeft, Leaf, Droplet, AlertTriangle, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExpertChat } from "./expert-chat"

interface DiagnosisResultProps {
  result: any
  onReset: () => void
}

import { useLanguage } from "@/contexts/language-context"

export function DiagnosisResult({ result, onReset }: DiagnosisResultProps) {
  const [showChat, setShowChat] = useState(false)
  const reportRef = useRef<HTMLDivElement | null>(null)
  const { t } = useLanguage()
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadReport = async () => {
    if (!reportRef.current) return
    setIsDownloading(true)
    try {
      // use html-to-image instead of html2canvas for better CSS compatibility
      // @ts-ignore - dynamic import
      const { toPng } = await import('html-to-image')
      // @ts-ignore - dynamic import
      const { jsPDF } = await import('jspdf')

      const dataUrl = await toPng(reportRef.current, { cacheBust: true, quality: 1, backgroundColor: '#ffffff' })
      const img = new Image()
      img.src = dataUrl
      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = rej
      })

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Ensure image fills page width (100%). If image height exceeds one page, split into multiple pages.
      const pxPerPt = img.width / pageWidth
      const pageHeightPx = Math.floor(pageHeight * pxPerPt)
      let remainingHeight = img.height
      let position = 0
      while (remainingHeight > 0) {
        const canvasPage = document.createElement('canvas')
        canvasPage.width = img.width
        canvasPage.height = Math.min(pageHeightPx, remainingHeight)
        const ctx = canvasPage.getContext('2d')
        ctx?.drawImage(img, 0, position, img.width, canvasPage.height, 0, 0, img.width, canvasPage.height)
        const pageDataUrl = canvasPage.toDataURL('image/png')
        const renderHeightPt = canvasPage.height / pxPerPt
        pdf.addImage(pageDataUrl, 'PNG', 0, 0, pageWidth, renderHeightPt)
        remainingHeight -= canvasPage.height
        position += canvasPage.height
        if (remainingHeight > 0) pdf.addPage()
      }
      pdf.save(`${(result?.issue || 'report').replace(/\s+/g, '_')}.pdf`)
    } catch (err) {
      console.error('PDF download failed', err)
    } finally {
      setIsDownloading(false)
    }
  }

  const confidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50"
    if (confidence >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-orange-600 bg-orange-50"
  }

  const severityBg = (severity: string) => {
    if (severity === "Critical") return "bg-red-50 border-red-200"
    if (severity === "Moderate") return "bg-yellow-50 border-yellow-200"
    return "bg-green-50 border-green-200"
  }

  const severityColor = (severity: string) => {
    if (severity === "Critical") return "bg-red-100 border-red-300 text-red-900"
    if (severity === "Moderate") return "bg-yellow-100 border-yellow-300 text-yellow-900"
    return "bg-green-100 border-green-300 text-green-900"
  }

  if (showChat) {
    return <ExpertChat diagnosis={result} onBack={() => setShowChat(false)} />
  }

  return (<>
    <div className="space-y-6" ref={reportRef}>
      {/* Header Card */}
      <Card className={`p-6 border-2 shadow-lg ${severityBg(result.severity)}`}>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.results.startNew}
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {result.severity === "Critical" ? (
              <AlertTriangle className="w-10 h-10 text-red-600" />
            ) : result.severity === "Moderate" ? (
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            ) : (
              <CheckCircle className="w-10 h-10 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">{result.issue}</h2>
            <p className="text-gray-600 text-lg mt-1">{result.type}</p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className={`px-4 py-2 rounded-lg font-semibold ${confidenceColor(result.confidence)}`}>
                {result.confidence}% {t.results.confidence}
              </div>
              <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${severityColor(result.severity)}`}>
                {result.severity} {t.results.severity}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Description Card */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          {t.results.diseaseDetails}
        </h3>
        <p className="text-gray-700 leading-relaxed text-base">{result.description}</p>
      </Card>

      {/* Treatment Plan Card */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          {t.results.treatmentPlan}
        </h3>
        <div className="space-y-2">
          {result.treatmentPlan.map((day: any, idx: number) => (
            <div
              key={idx}
              className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-400 transition-colors"
            >
              <div className="font-bold text-green-600 min-w-fit bg-green-100 px-3 py-1 rounded-lg">{day.day}</div>
              <div className="text-gray-700 flex-1 pt-1">{day.action}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Solutions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-lg">
          <h4 className="font-bold text-gray-900 mb-4 text-lg">{t.results.organicSolutions}</h4>
          <ul className="space-y-3">
            {result.treatments.organic.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h4 className="font-bold text-gray-900 mb-4 text-lg">{t.results.chemicalSolutions}</h4>
          <ul className="space-y-3">
            {result.treatments.chemical.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Yield Impact Card */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{t.results.yieldImpact}</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-medium">{t.results.yieldLoss}</span>
              <span className="text-2xl font-bold text-red-600">{result.yieldImpact.loss}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${result.yieldImpact.loss}%` }}
              />
            </div>
          </div>
          <p className="text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg">{result.yieldImpact.description}</p>
        </div>
      </Card>

      {/* Safety Warnings Card */}
      {result.safetyWarnings && result.safetyWarnings.length > 0 && (
        <Card className="p-6 border-2 border-yellow-200 bg-yellow-50 shadow-lg">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            {t.results.safetyWarnings}
          </h4>
          <ul className="space-y-3">
            {result.safetyWarnings.map((warning: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700">
                <span className="text-yellow-600 font-bold mt-0.5">!</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}


    </div>
    <div className="mt-5 grid w-full grid-cols-2 gap-5">
  {/* Download Report CTA */}
  <Button
    onClick={downloadReport}
    className="w-full"
    disabled={isDownloading}
  >
    {isDownloading ? (
      <span className="flex items-center justify-center gap-2">
        <svg
          className="w-5 h-5 animate-spin text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.2" />
          <path d="M22 12a10 10 0 00-10-10" strokeWidth="4" />
        </svg>
        Generating...
      </span>
    ) : (
      <>
        <Download className="w-5 h-5" />
        Download Report
      </>
    )}
  </Button>

  {/* Expert Chat CTA */}
  <Button
    onClick={() => setShowChat(true)}
    className="w-full"
  >
    <MessageSquare className="w-5 h-5" />
    {t.results.askExpert}
  </Button>
</div>
  </>
  )
}
