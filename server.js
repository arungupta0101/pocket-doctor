import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fallback to the user's latest key if not provided in env for immediate ease of use,
// but it's best read from .env.
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is missing from .env file.");
    process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt, systemInstruction } = req.body;

        const config = {};
        if (systemInstruction) {
            config.systemInstruction = systemInstruction;
        }

        // We can add logic to rotate keys later if they run out again, 
        // but for now, making calls from the server bypasses client-side 
        // fingerprint/IP rate limits from Google's end.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config,
        });

        res.json({ text: response.text || 'No response generated.' });
    } catch (error) {
        if (error.message?.includes('429') || error.message?.includes('quota')) {
            res.status(429).json({ error: '⏳ AI is busy right now. Please wait 30 seconds and try again.' });
        } else {
            console.error('Gemini API Error:', error);
            res.status(500).json({ error: error.message || 'Failed to get AI response.' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
