"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "./image-upload"
import { MetadataSelector } from "./metadata-selector"
import { DiagnosisResult } from "./diagnosis-result"
import { AnalyzingLoader } from "./analyzing-loader"
import { useLanguage } from "@/contexts/language-context"
import { dictionaries } from "@/lib/dictionaries"

export function DiagnosisForm() {
  const [images, setImages] = useState<File[]>([])
  const [metadata, setMetadata] = useState({
    cropType: "",
    growthStage: "",
    climateTags: [] as string[],
    soilObservation: "",
  })
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) {
      setError(t.diagnosisForm.uploadError)
      return
    }
    if (!metadata.cropType) {
      setError(t.diagnosisForm.cropError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      images.forEach((image) => formData.append("images", image))
      formData.append("metadata", JSON.stringify(metadata))
      const languageMap: Record<string, string> = {
        en: "English",
        hi: "Hindi",
        gu: "Gujarati",
        mr: "Marathi",
        te: "Telugu",
        ta: "Tamil",
        pa: "Punjabi",
      }
      // Get the current language key by comparing the current dictionary object 't' with the dictionaries map
      // This is slightly indirect but works since 't' is passed from context. 
      // A cleaner way would be to get 'language' directly from useLanguage()

      const currentLangCode = Object.keys(dictionaries).find(key => dictionaries[key as keyof typeof dictionaries] === t) || "en"
      formData.append("language", languageMap[currentLangCode] || "English")

      const response = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Diagnosis failed")
      }

      const data = await response.json()
      setDiagnosisResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AnalyzingLoader />
  }

  if (diagnosisResult) {
    return <DiagnosisResult result={diagnosisResult} onReset={() => setDiagnosisResult(null)} />
  }

  return (
    <Card className="p-6 border-0 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.diagnosisForm.title}</h2>
      <p className="text-gray-600 mb-6">{t.diagnosisForm.description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <ImageUpload images={images} setImages={setImages} />
        <MetadataSelector metadata={metadata} setMetadata={setMetadata} />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
        >
          {loading ? t.diagnosisForm.analyzing : t.diagnosisForm.analyzeButton}
        </Button>
      </form>
    </Card>
  )
}
