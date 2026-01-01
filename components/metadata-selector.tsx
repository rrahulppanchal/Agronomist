"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const CROP_TYPES = [
  "Corn",
  "Rice",
  "Wheat",
  "Tomato",
  "Potato",
  "Cabbage",
  "Apple",
  "Grape",
  "Lettuce",
  "Carrot",
  "Onion",
  "Cucumber",
  "Pepper",
  "Eggplant",
  "Spinach",
  "Broccoli",
  "Cauliflower",
  "Mango",
  "Citrus",
  "Sugarcane",
  "Cotton",
  "Soybean",
]

const GROWTH_STAGES = [
  "Germination",
  "Seedling",
  "Vegetative",
  "Tillering",
  "Flowering",
  "Fruiting",
  "Pod Development",
  "Maturity",
  "Senescence",
]

const CLIMATE_TAGS = [
  "Heavy Rain recently",
  "High Humidity",
  "Extreme Heat",
  "Cold Snap",
  "Low Humidity",
  "Drought Stress",
  "Frost Risk",
  "Strong Wind",
  "Hail",
  "Temperature Fluctuation",
  "Poor Air Circulation",
  "Dense Canopy",
]

const SOIL_OBSERVATIONS = [
  "Too dry",
  "Waterlogged",
  "Salty white crust",
  "Normal",
  "Poor drainage",
  "Compacted",
  "Acidic",
  "Alkaline",
  "Rich Organic Matter",
  "Sandy",
  "Clay Heavy",
  "Nutrient Deficiency",
  "Recent Floods",
]

const IRRIGATION_STATUS = [
  "Well-irrigated",
  "Drip Irrigation",
  "Rainfed",
  "Irregular",
  "Over-irrigated",
  "No Irrigation",
]

const DISEASE_HISTORY = [
  "No previous issues",
  "Previous fungal disease",
  "Previous bacterial disease",
  "Previous viral disease",
  "Pest infestation history",
  "Chemical damage",
  "Unknown",
]

interface ExtendedMetadata {
  cropType: string
  cropTypeOther?: string
  growthStage: string
  growthStageOther?: string
  climateTags: string[]
  climateTagsOther?: string
  soilObservation: string
  soilObservationOther?: string
  irrigationStatus?: string
  irrigationStatusOther?: string
  diseaseHistory?: string
  diseaseHistoryOther?: string
  farmerNotes?: string
}

interface MetadataProps {
  metadata: ExtendedMetadata
  setMetadata: (metadata: ExtendedMetadata) => void
}

export function MetadataSelector({ metadata, setMetadata }: MetadataProps) {
  const { t } = useLanguage()
  const [showCropOther, setShowCropOther] = useState(metadata.cropTypeOther ? true : false)
  const [showGrowthOther, setShowGrowthOther] = useState(metadata.growthStageOther ? true : false)
  const [showSoilOther, setShowSoilOther] = useState(metadata.soilObservationOther ? true : false)
  const [showIrrigationOther, setShowIrrigationOther] = useState(metadata.irrigationStatusOther ? true : false)
  const [showDiseaseOther, setShowDiseaseOther] = useState(metadata.diseaseHistoryOther ? true : false)
  const [showClimateOther, setShowClimateOther] = useState(metadata.climateTagsOther ? true : false)

  const updateClimateTag = (tag: string, checked: boolean) => {
    const updated = checked ? [...metadata.climateTags, tag] : metadata.climateTags.filter((t) => t !== tag)
    setMetadata({ ...metadata, climateTags: updated })
  }

  return (
    <div className="space-y-6">
      {/* Crop Type */}
      <div>
        <Label htmlFor="cropType" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.cropType.label}
        </Label>
        <Select
          value={metadata.cropType}
          onValueChange={(value) => {
            if (value === "other") {
              setShowCropOther(true)
              setMetadata({ ...metadata, cropType: value, cropTypeOther: "" })
            } else {
              setShowCropOther(false)
              setMetadata({ ...metadata, cropType: value, cropTypeOther: undefined })
            }
          }}
        >
          <SelectTrigger id="cropType" className="w-full">
            <SelectValue placeholder={t.metadata.cropType.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {CROP_TYPES.map((crop) => (
              <SelectItem key={crop} value={crop}>
                {t.options.crops[crop as keyof typeof t.options.crops] || crop}
              </SelectItem>
            ))}
            <SelectItem value="other">{t.common.other}</SelectItem>
          </SelectContent>
        </Select>
        {showCropOther && (
          <Input
            type="text"
            placeholder={t.metadata.cropType.otherPlaceholder}
            value={metadata.cropTypeOther || ""}
            onChange={(e) => setMetadata({ ...metadata, cropTypeOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Growth Stage */}
      <div>
        <Label htmlFor="growthStage" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.growthStage.label}
        </Label>
        <Select
          value={metadata.growthStage}
          onValueChange={(value) => {
            if (value === "other") {
              setShowGrowthOther(true)
              setMetadata({ ...metadata, growthStage: value, growthStageOther: "" })
            } else {
              setShowGrowthOther(false)
              setMetadata({ ...metadata, growthStage: value, growthStageOther: undefined })
            }
          }}
        >
          <SelectTrigger id="growthStage" className="w-full">
            <SelectValue placeholder={t.metadata.growthStage.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {GROWTH_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {t.options.growthStages[stage as keyof typeof t.options.growthStages] || stage}
              </SelectItem>
            ))}
            <SelectItem value="other">{t.common.other}</SelectItem>
          </SelectContent>
        </Select>
        {showGrowthOther && (
          <Input
            type="text"
            placeholder={t.metadata.growthStage.otherPlaceholder}
            value={metadata.growthStageOther || ""}
            onChange={(e) => setMetadata({ ...metadata, growthStageOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Soil Observation */}
      <div>
        <Label htmlFor="soilObservation" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.soilObservation.label}
        </Label>
        <Select
          value={metadata.soilObservation}
          onValueChange={(value) => {
            if (value === "other") {
              setShowSoilOther(true)
              setMetadata({ ...metadata, soilObservation: value, soilObservationOther: "" })
            } else {
              setShowSoilOther(false)
              setMetadata({ ...metadata, soilObservation: value, soilObservationOther: undefined })
            }
          }}
        >
          <SelectTrigger id="soilObservation" className="w-full">
            <SelectValue placeholder={t.metadata.soilObservation.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {SOIL_OBSERVATIONS.map((obs) => (
              <SelectItem key={obs} value={obs}>
                {t.options.soil[obs as keyof typeof t.options.soil] || obs}
              </SelectItem>
            ))}
            <SelectItem value="other">{t.common.other}</SelectItem>
          </SelectContent>
        </Select>
        {showSoilOther && (
          <Input
            type="text"
            placeholder={t.metadata.soilObservation.otherPlaceholder}
            value={metadata.soilObservationOther || ""}
            onChange={(e) => setMetadata({ ...metadata, soilObservationOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Irrigation Status */}
      <div>
        <Label htmlFor="irrigationStatus" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.irrigationStatus.label}
        </Label>
        <Select
          value={metadata.irrigationStatus || ""}
          onValueChange={(value) => {
            if (value === "other") {
              setShowIrrigationOther(true)
              setMetadata({ ...metadata, irrigationStatus: value, irrigationStatusOther: "" })
            } else {
              setShowIrrigationOther(false)
              setMetadata({ ...metadata, irrigationStatus: value, irrigationStatusOther: undefined })
            }
          }}
        >
          <SelectTrigger id="irrigationStatus" className="w-full">
            <SelectValue placeholder={t.metadata.irrigationStatus.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {IRRIGATION_STATUS.map((status) => (
              <SelectItem key={status} value={status}>
                {t.options.irrigation[status as keyof typeof t.options.irrigation] || status}
              </SelectItem>
            ))}
            <SelectItem value="other">{t.common.other}</SelectItem>
          </SelectContent>
        </Select>
        {showIrrigationOther && (
          <Input
            type="text"
            placeholder={t.metadata.irrigationStatus.otherPlaceholder}
            value={metadata.irrigationStatusOther || ""}
            onChange={(e) => setMetadata({ ...metadata, irrigationStatusOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Disease/Pest History */}
      <div>
        <Label htmlFor="diseaseHistory" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.diseaseHistory.label}
        </Label>
        <Select
          value={metadata.diseaseHistory || ""}
          onValueChange={(value) => {
            if (value === "other") {
              setShowDiseaseOther(true)
              setMetadata({ ...metadata, diseaseHistory: value, diseaseHistoryOther: "" })
            } else {
              setShowDiseaseOther(false)
              setMetadata({ ...metadata, diseaseHistory: value, diseaseHistoryOther: undefined })
            }
          }}
        >
          <SelectTrigger id="diseaseHistory" className="w-full">
            <SelectValue placeholder={t.metadata.diseaseHistory.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {DISEASE_HISTORY.map((history) => (
              <SelectItem key={history} value={history}>
                {t.options.history[history as keyof typeof t.options.history] || history}
              </SelectItem>
            ))}
            <SelectItem value="other">{t.common.other}</SelectItem>
          </SelectContent>
        </Select>
        {showDiseaseOther && (
          <Input
            type="text"
            placeholder={t.metadata.diseaseHistory.otherPlaceholder}
            value={metadata.diseaseHistoryOther || ""}
            onChange={(e) => setMetadata({ ...metadata, diseaseHistoryOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Climate Conditions */}
      <div>
        <Label htmlFor="climateConditions" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.climateConditions.label}
        </Label>
        <Select
          onValueChange={(value) => {
            if (value !== "other" && !metadata.climateTags.includes(value)) {
              setMetadata({ ...metadata, climateTags: [...metadata.climateTags, value] })
            } else if (value === "other") {
              setShowClimateOther(true)
            }
          }}
        >
          <SelectTrigger id="climateConditions" className="w-full">
            <SelectValue placeholder={t.metadata.climateConditions.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {CLIMATE_TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {t.options.climate[tag as keyof typeof t.options.climate] || tag}
              </SelectItem>
            ))}
            <SelectItem value="other">{t.common.other}</SelectItem>
          </SelectContent>
        </Select>

        {/* Display selected climate tags */}
        {metadata.climateTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {metadata.climateTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-2 pl-3">
                {t.options.climate[tag as keyof typeof t.options.climate] || tag}
                <button
                  onClick={() =>
                    setMetadata({
                      ...metadata,
                      climateTags: metadata.climateTags.filter((t) => t !== tag),
                    })
                  }
                  className="hover:bg-gray-300 rounded p-0.5 transition"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {showClimateOther && (
          <Input
            type="text"
            placeholder={t.metadata.climateConditions.otherPlaceholder}
            value={metadata.climateTagsOther || ""}
            onChange={(e) => setMetadata({ ...metadata, climateTagsOther: e.target.value })}
            className="mt-2"
          />
        )}
      </div>

      {/* Additional Farmer Notes */}
      <div>
        <Label htmlFor="farmerNotes" className="text-sm font-semibold text-gray-900 mb-2 block">
          {t.metadata.notes.label}
        </Label>
        <textarea
          id="farmerNotes"
          placeholder={t.metadata.notes.placeholder}
          value={metadata.farmerNotes || ""}
          onChange={(e) => setMetadata({ ...metadata, farmerNotes: e.target.value })}
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none h-24"
        />
      </div>
    </div>
  )
}
