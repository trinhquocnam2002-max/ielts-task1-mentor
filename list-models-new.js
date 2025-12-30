const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function listModels() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error(".env.local not found");
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        let apiKey = '';
        for (const line of lines) {
            if (line.trim().startsWith('GEMINI_API_KEY=')) {
                apiKey = line.split('=')[1].trim();
                if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
                    apiKey = apiKey.slice(1, -1);
                }
                break;
            }
        }

        if (!apiKey) {
            console.error("GEMINI_API_KEY not found");
            return;
        }

        console.log("Using API Key ending in: ...", apiKey.slice(-4));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`Error listing models: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response body:", text);
            return;
        }

        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models returned in list.");
        }

    } catch (err) {
        console.error("Script error:", err);
    }
}

listModels();
