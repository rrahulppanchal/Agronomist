import { neon } from "@neondatabase/serverless"

// Create reusable SQL client
function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }
  return neon(process.env.DATABASE_URL) as any
}

// Type definitions
export interface Diagnosis {
  id: string
  crop_type: string
  issue: string
  issue_type: string
  confidence: number
  severity: string
  description: string
  treatments_organic: string[]
  treatments_chemical: string[]
  yield_impact: number
  safety_warnings: string[]
  created_at: string
}

export interface ChatMessage {
  id: string
  diagnosis_id: string
  message_type: "user" | "assistant"
  content: string
  created_at: string
}

// Database operations
export async function saveDiagnosis(data: {
  cropType: string
  issue: string
  issueType: string
  confidence: number
  severity: string
  description: string
  treatmentsOrganic: string[]
  treatmentsChemical: string[]
  yieldImpact: number
  safetyWarnings: string[]
}) {
  const sql = getSql()
  const result = await sql(
    `
    INSERT INTO diagnoses (
      crop_type, issue, issue_type, confidence, severity, description,
      treatments_organic, treatments_chemical, yield_impact, safety_warnings
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `,
    [
      data.cropType,
      data.issue,
      data.issueType,
      data.confidence,
      data.severity,
      data.description,
      data.treatmentsOrganic,
      data.treatmentsChemical,
      data.yieldImpact,
      data.safetyWarnings,
    ],
  )
  return result[0]
}

export async function saveChatMessage(diagnosisId: string, messageType: "user" | "assistant", content: string) {
  const sql = getSql()
  const result = await sql(
    `
    INSERT INTO chat_messages (diagnosis_id, message_type, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    [diagnosisId, messageType, content],
  )
  return result[0]
}

export async function getRecentDiagnoses(limit = 10) {
  const sql = getSql()
  const results = await sql(
    `
    SELECT * FROM diagnoses
    ORDER BY created_at DESC
    LIMIT $1
  `,
    [limit],
  )
  return results
}

export async function getDiagnosisById(id: string) {
  const sql = getSql()
  const result = await sql(
    `
    SELECT * FROM diagnoses WHERE id = $1
  `,
    [id],
  )
  return result[0]
}

export async function getChatHistory(diagnosisId: string) {
  const sql = getSql()
  const results = await sql(
    `
    SELECT * FROM chat_messages
    WHERE diagnosis_id = $1
    ORDER BY created_at ASC
  `,
    [diagnosisId],
  )
  return results
}
