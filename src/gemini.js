// Gemini API helper - connecting to local server proxy
export async function callGemini(prompt, systemInstruction = '') {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemInstruction }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `API error: ${response.status}`);
        }

        return data.text;
    } catch (error) {
        if (error.message?.includes('429') || error.message?.includes('buy') || error.message?.includes('quota')) {
            throw new Error('⏳ AI is busy right now. Please wait 30 seconds and try again.');
        }
        throw new Error(error.message || 'Failed to get AI response.');
    }
}

// Symptom analysis prompt
export function buildSymptomPrompt(symptoms, profile) {
    const profileInfo = profile.age ? `Patient: ${profile.age} years old, Blood Group: ${profile.bloodGroup || 'Unknown'}, Known Allergies: ${profile.allergies || 'None'}, Existing Conditions: ${profile.conditions || 'None'}` : '';

    return `You are a medical information assistant. Analyze these symptoms and provide helpful health information.

${profileInfo ? `Patient Info: ${profileInfo}` : ''}

Symptoms described: ${symptoms}

Please respond in this EXACT JSON format (no markdown, just pure JSON):
{
  "possibleConditions": [
    {
      "name": "Condition Name",
      "probability": "High/Medium/Low",
      "description": "Brief description",
      "severity": "mild/moderate/severe"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "whenToSeeDoctor": "When they should consult a doctor",
  "homeRemedies": ["remedy 1", "remedy 2"],
  "disclaimer": "This is not medical advice. Please consult a healthcare professional."
}`;
}

// Doctor chat system instruction
export const DOCTOR_SYSTEM_PROMPT = `You are "Dr. AI", a friendly and knowledgeable medical information assistant in the Pocket Doctor app. You provide helpful health information and guidance.

Important rules:
1. Always be empathetic and caring in your responses
2. Provide accurate, evidence-based health information
3. Always recommend consulting a real doctor for serious concerns
4. Never diagnose - only provide informational guidance
5. Keep responses concise but thorough
6. Use simple language that anyone can understand
7. If asked about emergencies, immediately advise calling emergency services (108 in India)
8. Include a gentle disclaimer when providing health information
9. You can answer in Hindi or English based on the user's language`;
