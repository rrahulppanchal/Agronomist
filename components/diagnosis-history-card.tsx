"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, MessageSquare, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface HistoryCardProps {
  diagnosis: {
    id: string
    cropType: string
    issue: string
    severity: string
    confidence: number
    createdAt: string
    chatMessages: number
    yield_impact: number
  }
  onViewDetails: (diagnosis: any) => void
}

export function DiagnosisHistoryCard({ diagnosis, onViewDetails }: HistoryCardProps) {
  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300"
      case "Moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "Mild":
        return "bg-green-100 text-green-700 border-green-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <Card
      className="p-4 md:p-6 border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onViewDetails(diagnosis)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Top Row */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">{diagnosis.issue}</h3>
            <Badge className={getSeverityBadgeColor()}>{diagnosis.severity}</Badge>
            <Badge variant="outline" className="bg-blue-50">
              {diagnosis.confidence}% Confidence
            </Badge>
          </div>

          {/* Middle Row */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="font-medium">Crop:</span> {diagnosis.cropType}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Yield Impact: {diagnosis.yield_impact}%
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {diagnosis.chatMessages} chat messages
            </span>
          </div>

          {/* Bottom Row */}
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(diagnosis.createdAt), { addSuffix: true })}
          </p>
        </div>

        {/* Right Side Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-green-50 text-green-600"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(diagnosis)
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
