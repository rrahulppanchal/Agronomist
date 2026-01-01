"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Calendar, Leaf, AlertCircle, MessageSquare } from "lucide-react"
import { DiagnosisHistoryCard } from "./diagnosis-history-card"
import { DiagnosisDetailModal } from "./diagnosis-detail-modal"

// Dummy data
const DUMMY_DIAGNOSES = [
  {
    id: "1",
    cropType: "Tomato",
    issue: "Early Blight",
    severity: "Moderate",
    confidence: 92,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Fungal infection showing brown spots with concentric rings on lower leaves",
    treatments_organic: ["Copper fungicide", "Neem oil spray"],
    treatments_chemical: ["Chlorothalonil", "Mancozeb"],
    yield_impact: 35,
    safety_warnings: ["Avoid spraying during flowering"],
    chatMessages: 3,
  },
  {
    id: "2",
    cropType: "Corn",
    issue: "Gray Leaf Spot",
    severity: "Critical",
    confidence: 88,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Fungal disease causing rectangular gray lesions on leaves",
    treatments_organic: ["Bacillus subtilis", "Sulfur dust"],
    treatments_chemical: ["Propiconazole", "Azoxystrobin"],
    yield_impact: 60,
    safety_warnings: ["Use PPE when applying chemicals", "Avoid wind during application"],
    chatMessages: 5,
  },
  {
    id: "3",
    cropType: "Wheat",
    issue: "Powdery Mildew",
    severity: "Mild",
    confidence: 95,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "White powder-like coating on leaves and stems",
    treatments_organic: ["Baking soda spray", "Milk solution"],
    treatments_chemical: ["Sulfur", "Triazole fungicides"],
    yield_impact: 15,
    safety_warnings: ["Monitor weather conditions"],
    chatMessages: 2,
  },
  {
    id: "4",
    cropType: "Rice",
    issue: "Blast Disease",
    severity: "Critical",
    confidence: 91,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Fungal infection causing diamond-shaped lesions on leaves",
    treatments_organic: ["Trichoderma", "Silicon application"],
    treatments_chemical: ["Tricyclazole", "Isoprothiolane"],
    yield_impact: 70,
    safety_warnings: ["Early detection is critical", "Apply fungicide immediately"],
    chatMessages: 8,
  },
  {
    id: "5",
    cropType: "Potato",
    issue: "Late Blight",
    severity: "Moderate",
    confidence: 89,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Water-soaked lesions on leaves spreading to tubers",
    treatments_organic: ["Copper fungicide", "Compost"],
    treatments_chemical: ["Metalaxyl-M", "Mancozeb"],
    yield_impact: 45,
    safety_warnings: ["Remove affected plants immediately"],
    chatMessages: 4,
  },
]

export function DiagnosisHistoryList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<(typeof DUMMY_DIAGNOSES)[0] | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredDiagnoses = DUMMY_DIAGNOSES.filter(
    (diagnosis) =>
      diagnosis.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diagnosis.issue.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (diagnosis: (typeof DUMMY_DIAGNOSES)[0]) => {
    setSelectedDiagnosis(diagnosis)
    setShowModal(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 bg-red-50"
      case "Moderate":
        return "text-yellow-600 bg-yellow-50"
      case "Mild":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by crop type or disease name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border-green-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Diagnoses</p>
              <p className="text-2xl font-bold text-gray-900">{DUMMY_DIAGNOSES.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Critical Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {DUMMY_DIAGNOSES.filter((d) => d.severity === "Critical").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  DUMMY_DIAGNOSES.filter((d) => new Date(d.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000)
                    .length
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Chats</p>
              <p className="text-2xl font-bold text-gray-900">
                {(DUMMY_DIAGNOSES.reduce((acc, d) => acc + d.chatMessages, 0) / DUMMY_DIAGNOSES.length).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <Button variant="outline" className="whitespace-nowrap border-green-300 hover:bg-green-50 bg-transparent">
          All Diagnoses
        </Button>
        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          Critical
        </Button>
        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          Moderate
        </Button>
        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          Mild
        </Button>
        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          This Month
        </Button>
      </div>

      {/* Diagnosis List */}
      <div className="space-y-4">
        {filteredDiagnoses.length > 0 ? (
          filteredDiagnoses.map((diagnosis) => (
            <DiagnosisHistoryCard key={diagnosis.id} diagnosis={diagnosis} onViewDetails={handleViewDetails} />
          ))
        ) : (
          <Card className="p-12 text-center border-gray-200">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No diagnoses found matching your search.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters.</p>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDiagnosis && (
        <DiagnosisDetailModal diagnosis={selectedDiagnosis} isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
