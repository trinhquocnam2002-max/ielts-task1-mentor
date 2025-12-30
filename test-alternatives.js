const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function testModels() {
    const apiKey = "AIzaSyDq3ZWOjn88LLNCBdhl5nvCRpNijJ6OtuA";
    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = ["gemini-2.5-flash", "gemini-2.0-flash-lite-preview-02-05", "gemini-flash-latest"];

    for (const modelName of candidates) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`SUCCESS with ${modelName}`);
            return; // Stop after first success
        } catch (e) {
            console.error(`FAILED ${modelName}:`, e.message);
        }
    }
}

testModels();
