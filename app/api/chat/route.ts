import { type NextRequest, NextResponse } from "next/server"
import { saveChatMessage } from "@/lib/db"

const chatSystemInstruction = `You are an experienced Agricultural Expert Assistant helping farmers with plant health questions. 

Your role is to:
1. Answer follow-up questions about diagnosed issues
2. Clarify treatment procedures and timing
3. Address safety concerns about chemicals or organic treatments
4. Provide context-specific advice based on the original diagnosis
5. Suggest preventive measures for the future
6. Use simple, farmer-friendly language
7. Always prioritize safety

Keep responses concise, practical, and actionable. If you don't know something, admit it and suggest consulting a local agricultural extension officer.`

export async function POST(request: NextRequest) {
  try {
    const { messages, diagnosis, diagnosisId } = await request.json()

    if (!messages || !diagnosis) {
      return NextResponse.json({ error: "Missing messages or diagnosis context" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_API_KEY is not set" }, { status: 500 })
    }

    // Build chat history with context about the diagnosis
    const chatHistory = [
      {
        role: "user",
        parts: [
          {
            text: `Current diagnosis: ${diagnosis.issue} (${diagnosis.type}). Confidence: ${diagnosis.confidence}%. Severity: ${diagnosis.severity}.`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `I understand. I'm ready to help with questions about the detected ${diagnosis.issue}. What would you like to know?`,
          },
        ],
      },
      ...messages.map((msg: any) => ({
        role: msg.type === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ]

    // Construct the request body for the REST API
    const requestBody = {
      contents: chatHistory,
      systemInstruction: {
        parts: [{ text: chatSystemInstruction }],
      },
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API failed: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const responseData = await response.json()

    // Extract text from the response safely
    const responseText =
      responseData.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response."

    try {
      if (diagnosisId) {
        await saveChatMessage(diagnosisId, "user", messages[messages.length - 1].content)
        await saveChatMessage(diagnosisId, "assistant", responseText)
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue even if database save fails
    }

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Chat failed" }, { status: 500 })
  }
}
