// Groq API URL
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// ── Environment variable validation ────────────────────────────────────────
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!GROQ_KEY) {
  console.error('❌ VITE_GROQ_API_KEY is missing — add it to Vercel Environment Variables')
} else {
  console.log('✅ Groq API key loaded successfully')
}

if (!GEMINI_KEY) {
  console.warn('⚠️  VITE_GEMINI_API_KEY is missing — add it to Vercel Environment Variables')
} else {
  console.log('✅ Gemini API key loaded successfully')
}

/**
 * True when the Groq key is absent — used by the UI to show a warning banner.
 */
export const isApiKeyMissing = !GROQ_KEY

export async function analyzeDecision(situation, category = 'general', urgency = 'medium') {

  // Check if API key exists — return a special sentinel so the UI can
  // distinguish a missing-key error from a normal mock fallback.
  if (!GROQ_KEY) {
    console.warn('⚠️  Groq API key not configured — AI analysis unavailable')
    return { __missingKey: true, ...getMockResponse(situation) }
  }

  const prompt = `You are a life decision coach. Analyze this decision carefully and return ONLY a valid JSON object. No markdown, no backticks, no extra text. Just raw JSON.

Decision: "${situation}"
Category: ${category}
Urgency: ${urgency}

Return exactly this JSON structure:
{
  "pros": ["specific pro 1", "specific pro 2", "specific pro 3"],
  "cons": ["specific con 1", "specific con 2", "specific con 3"],
  "riskLevel": "Low",
  "riskScore": 35,
  "suggestedPath": "A clear specific recommendation based on this exact situation",
  "reasoning": "A detailed explanation of why this path makes sense for this specific decision",
  "timeframe": "3-6 months",
  "outcomes": {
    "bestCase": "Specific best case outcome for this decision",
    "worstCase": "Specific worst case outcome for this decision",
    "mostLikely": "Most realistic outcome for this decision"
  },
  "actionSteps": ["First concrete step", "Second concrete step", "Third concrete step"]
}

IMPORTANT: 
- Make ALL responses SPECIFIC to the decision "${situation}"
- riskLevel must be exactly "Low", "Medium", or "High"
- riskScore must be a number between 0 and 100
- Do NOT give generic advice
- Do NOT say "more information needed"
- Base your analysis on the decision as stated`

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) throw new Error('No response from Groq')

    // Clean the response — remove any markdown backticks if present
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)
    
    // Track usage
    trackUsage()
    
    return parsed

  } catch (error) {
    console.error('Groq error:', error)
    // Return mock if API fails
    return getMockResponse(situation)
  }
}

// Track daily usage
function trackUsage() {
  const today = new Date().toDateString()
  const stored = localStorage.getItem('lifeos_ai_usage')
  const usage = stored ? JSON.parse(stored) : { date: today, count: 0 }
  
  if (usage.date !== today) {
    localStorage.setItem('lifeos_ai_usage', JSON.stringify({ date: today, count: 1 }))
  } else {
    usage.count += 1
    localStorage.setItem('lifeos_ai_usage', JSON.stringify(usage))
  }
}

// Get daily usage count
export function getUsageCount() {
  const today = new Date().toDateString()
  const stored = localStorage.getItem('lifeos_ai_usage')
  if (!stored) return 0
  const usage = JSON.parse(stored)
  return usage.date === today ? usage.count : 0
}

// Check if limit reached
export function isLimitReached() {
  return getUsageCount() >= 5
}

// Fallback mock response
function getMockResponse(situation) {
  return {
    pros: [
      "Opens new opportunities for growth",
      "Builds valuable long-term skills",
      "Can lead to greater independence"
    ],
    cons: [
      "Requires significant time investment",
      "Outcome is uncertain initially",
      "May involve short-term sacrifice"
    ],
    riskLevel: "Medium",
    riskScore: 50,
    suggestedPath: `Based on your situation about "${situation}", take a structured approach — research thoroughly, start small, and validate before fully committing.`,
    reasoning: "Without more context this is a balanced decision. The key is to gather more information and test your assumptions before making a final call.",
    timeframe: "1-3 months",
    outcomes: {
      bestCase: "You gain new skills, opportunities, and confidence from making this move.",
      worstCase: "It doesn't work out as planned but you gain valuable experience and lessons.",
      mostLikely: "Steady progress with some challenges along the way leading to a positive outcome."
    },
    actionSteps: [
      "Research this decision thoroughly for 1 week",
      "Talk to 3 people who have faced a similar situation",
      "Make a small commitment to test the waters before going all in"
    ]
  }
}
