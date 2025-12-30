import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Update to gemini-2.5-flash as per available models
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an IELTS Examiner. Grade this Task 1 essay: "${content}". 
    Return ONLY a JSON object with: overall_score, task_response, coherence, lexical, grammar, and a short feedback.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Làm sạch chuỗi JSON từ AI (đôi khi AI trả về kèm \`\`\`json ...)
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const jsonResponse = JSON.parse(cleanJson);

        // Save to Database (Preserving Dashboard functionality)
        try {
            await db.iELTS_Scores.create({
                data: {
                    essay_content: content,
                    band_score: String(jsonResponse.overall_score),
                    feedback_json: JSON.stringify([jsonResponse.feedback]), // Wrap in array to match old major_errors format mostly, or just stringify the whole thing
                },
            });
        } catch (dbError) {
            console.error("Failed to save to database:", dbError);
        }

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("API Error Detail:", error); // Log lỗi ra terminal để Manager kiểm tra
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
