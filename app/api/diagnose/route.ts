import { type NextRequest, NextResponse } from "next/server"
import { saveDiagnosis } from "@/lib/db"

const systemInstruction = `You are a Senior Agronomist specialized in tropical and temperate agriculture with expertise in plant disease diagnosis. Your goal is to provide accurate disease diagnosis, high-yield recovery strategies, and practical, region-appropriate treatment schedules.

When analyzing plant images with provided context:
1. Identify the specific disease, pest, or nutritional deficiency
2. Assess confidence level (0-100%)
3. Determine severity (Mild, Moderate, Critical)
4. Provide a detailed description of what you observe
5. Create a practical treatment plan with a dynamic duration tailored to the severity and local practices — choose an appropriate duration (for example 3–21 days or longer if needed) and provide day-by-day or phase-by-phase actions. If a 7-day plan is sufficient, explicitly state why.
6. Adapt treatments to local prevalent remedies and practices based on the provided location/region (use metadata.region, metadata.location, metadata.country or infer from climate tags). Include vernacular/local names for remedies and note commonly available organic solutions and chemical products in the region.
7. Recommend both organic and chemical solutions with specific active ingredients and dosing/usage instructions, and note availability considerations for the given region.
8. Estimate yield impact if untreated
9. Include safety warnings about chemical handling and any precautions specific to local practices
10. Provide a short justification for why the selected duration and remedies suit the local context

Always respond in valid JSON format with the following structure:
{
  "issue": "Disease/Issue Name",
  "type": "Fungal/Bacterial/Pest/Nutritional",
  "confidence": 0-100,
  "severity": "Mild/Moderate/Critical",
  "description": "Detailed description of observations",
  "recommendedDuration": "N days or 'ongoing until resolution'",
  "treatmentPlan": [
    {"day": "Day 1", "action": "specific action"},
    ...
  ],
  "treatments": {
    "organic": ["local remedy (vernacular name) - preparation/method"],
    "chemical": ["product name (active ingredient) - concentration/dosage instructions"]
  },
  "availabilityNotes": "Notes on availability and common local brands/alternatives",
  "yieldImpact": {
    "loss": 0-100,
    "description": "Impact description if untreated"
  },
  "safetyWarnings": ["Always wear a mask", "Avoid contact with skin", ...]
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const images: File[] = []
    let metadata = null
    let language = "English"

    // Extract all image files and metadata
    for (const [key, value] of formData.entries()) {
      if (key === "images") {
        images.push(value as File)
      } else if (key === "metadata") {
        metadata = JSON.parse(value as string)
      } else if (key === "language") {
        language = value as string
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_API_KEY is not set" }, { status: 500 })
    }

    // Convert images to base64
    const imageData = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer()
        return Buffer.from(buffer).toString("base64")
      }),
    )

    // Build the prompt with context
    const contextPrompt = `
Please analyze these plant images with the following context:

Plant Information:
- Crop Type: ${metadata?.cropType || "Unknown"}
- Growth Stage: ${metadata?.growthStage || "Unknown"}
- Region / Location: ${metadata?.region || metadata?.location || metadata?.country || "Unknown"}
- Climate Conditions: ${metadata?.climateTags?.join(", ") || "Not specified"}
- Soil Observation: ${metadata?.soilObservation || "Not specified"}

Images provided: ${images.length} photo(s)

IMPORTANT: Provide the diagnosis and all text content in ${language}.
The JSON keys must remain in English (e.g., "issue", "treatmentPlan"), but the values strings should be in ${language}.
Tailor the treatment plan and recommended remedies to the Region/Location above — include vernacular/local remedy names and commonly available products or alternatives, and note availability considerations.
`

    const content = {
      parts: [
        { text: contextPrompt },
        ...imageData.map((base64) => ({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64,
          },
        })),
      ],
    }

    // Construct request body
    const requestBody = {
      contents: [content],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        response_mime_type: "application/json",
      },
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API failed: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const responseData = await response.json()
    const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      throw new Error("Empty response from AI model")
    }

    // Parse JSON response (it might be wrapped in ```json ... ``` blocks even with response_mime_type set, but usually it's clean JSON)
    // The prompt explicitly asks for JSON, and response_mime_type should enforce it, but let's be safe.
    let diagnosis
    try {
      diagnosis = JSON.parse(responseText)
    } catch (e) {
      // Fallback regex matching if strict JSON parsing fails directly
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Failed to parse diagnosis response: " + e)
      }
      diagnosis = JSON.parse(jsonMatch[0])
    }


    try {
      const savedDiagnosis = await saveDiagnosis({
        cropType: metadata?.cropType || "Unknown",
        issue: diagnosis.issue,
        issueType: diagnosis.type,
        confidence: diagnosis.confidence,
        severity: diagnosis.severity,
        description: diagnosis.description,
        treatmentsOrganic: diagnosis.treatments?.organic || [],
        treatmentsChemical: diagnosis.treatments?.chemical || [],
        yieldImpact: diagnosis.yieldImpact?.loss || 0,
        safetyWarnings: diagnosis.safetyWarnings || [],
      })
      diagnosis.diagnosisId = savedDiagnosis.id
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue even if database save fails
    }

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error("Diagnosis error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Diagnosis failed" }, { status: 500 })
  }
}
