"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DetailModalProps {
  diagnosis: {
    id: string
    cropType: string
    issue: string
    severity: string
    confidence: number
    createdAt: string
    description: string
    treatments_organic: string[]
    treatments_chemical: string[]
    yield_impact: number
    safety_warnings: string[]
    chatMessages: number
  }
  isOpen: boolean
  onClose: () => void
}

export function DiagnosisDetailModal({ diagnosis, isOpen, onClose }: DetailModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const [isDownloading, setIsDownloading] = useState(false)

  const downloadDetailReport = async () => {
    if (!modalRef.current) return
    setIsDownloading(true)
    try {
      // @ts-ignore - dynamic import
      const { toPng } = await import('html-to-image')
      // @ts-ignore - dynamic import
      const { jsPDF } = await import('jspdf')

      const dataUrl = await toPng(modalRef.current, { cacheBust: true, quality: 1, backgroundColor: '#ffffff' })
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
      pdf.save(`${(diagnosis?.issue || 'diagnosis').replace(/\s+/g, '_')}.pdf`)
    } catch (err) {
      console.error('PDF download failed', err)
    } finally {
      setIsDownloading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700"
      case "Moderate":
        return "bg-yellow-100 text-yellow-700"
      case "Mild":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" ref={modalRef}>
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle className="text-2xl mb-2">{diagnosis.issue}</DialogTitle>
              <div className="flex gap-2">
                <Badge className={getSeverityColor(diagnosis.severity)}>{diagnosis.severity}</Badge>
                <Badge variant="outline">{diagnosis.confidence}% Confidence</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Crop Type</p>
              <p className="font-semibold text-gray-900">{diagnosis.cropType}</p>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Yield Impact</p>
              <p className="font-semibold text-gray-900">{diagnosis.yield_impact}%</p>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Disease Description</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{diagnosis.description}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="treatments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="chat">Chat History</TabsTrigger>
            </TabsList>

            <TabsContent value="treatments" className="space-y-4">
              <div>
                <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">Organic Solutions</h3>
                <div className="space-y-2">
                  {diagnosis.treatments_organic.map((treatment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span className="text-gray-700">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">Chemical Solutions</h3>
                <div className="space-y-2">
                  {diagnosis.treatments_chemical.map((treatment, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-gray-700">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <h3 className="font-semibold text-gray-900">Safety Warnings</h3>
              <div className="space-y-2">
                {diagnosis.safety_warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-red-600 font-bold mt-0.5">!</span>
                    <span className="text-gray-700">{warning}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">{diagnosis.chatMessages} conversation messages</p>
                <p className="text-gray-500 text-sm mt-2">View full chat history in the diagnosis details</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Open Chat</Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Metadata */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <span>Diagnosed {formatDistanceToNow(new Date(diagnosis.createdAt), { addSuffix: true })}</span>
            <Button variant="ghost" size="sm" className="gap-2" onClick={downloadDetailReport} disabled={isDownloading}>
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.2"></circle>
                    <path d="M22 12a10 10 0 00-10-10" strokeWidth="4"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
