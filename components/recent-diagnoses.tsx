"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export function RecentDiagnoses() {
  const recentDiagnoses = [
    {
      id: 1,
      crop: "Tomato",
      issue: "Early Blight",
      confidence: 87,
      date: "Today",
    },
    {
      id: 2,
      crop: "Wheat",
      issue: "Septoria Leaf Blotch",
      confidence: 92,
      date: "Yesterday",
    },
    {
      id: 3,
      crop: "Corn",
      issue: "Healthy Plant",
      confidence: 95,
      date: "2 days ago",
    },
  ]

  return (
    <Card className="p-6 border-0 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Diagnoses</h3>
      <div className="space-y-3">
        {recentDiagnoses.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            {diagnosis.issue === "Healthy Plant" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{diagnosis.crop}</p>
              <p className="text-xs text-gray-600 truncate">{diagnosis.issue}</p>
              <p className="text-xs text-gray-500 mt-1">{diagnosis.date}</p>
            </div>
            <span className="text-xs font-semibold text-green-600">{diagnosis.confidence}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
