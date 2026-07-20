import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Initialize Gemini API client securely on the server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  
  // Parse incoming JSON payloads
  app.use(express.json());

  // AI Endpoint: Generate Career Objective
  app.post("/api/ai/objective", async (req: Request, res: Response) => {
    try {
      const { professionalTitle, skills, details } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const prompt = `Generate a powerful, professional, and modern resume summary/career objective (around 3 to 4 sentences or 60-80 words).
      The style should be confident, tailored, and impact-driven. Avoid generic sentences and use active professional language.
      
      Professional Title: ${professionalTitle || "Software Professional"}
      Key Skills: ${skills ? (Array.isArray(skills) ? skills.join(", ") : skills) : "General Tech Skills"}
      Additional Details/Interests: ${details || "None provided"}
      
      Return ONLY the generated summary text. Do not include markdown formatting or titles.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const resultText = response.text?.trim() || "";
      res.json({ result: resultText });
    } catch (error: any) {
      console.error("AI Objective Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate summary" });
    }
  });

  // AI Endpoint: Refine Work Experience Responsibilities
  app.post("/api/ai/refine-experience", async (req: Request, res: Response) => {
    try {
      const { companyName, jobRole, responsibilities } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const prompt = `You are an expert resume writer and career coach.
      Rewrite and refine the following work experience responsibilities to make them sound highly professional, results-oriented, and impactful.
      Use strong action verbs (e.g., Led, Developed, Optimized, Architected) and structure the response as elegant, high-impact bullet points (using bullet character •).
      If possible, suggest where metrics or percentages could be added (e.g., "by [X]%" or "for [Y] clients").
      
      Company Name: ${companyName || "N/A"}
      Job Role: ${jobRole || "N/A"}
      Current Responsibilities/Text:
      ${responsibilities || "N/A"}

      Return ONLY the refined bulleted points. Keep it clear, concise, and professional.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const resultText = response.text?.trim() || "";
      res.json({ result: resultText });
    } catch (error: any) {
      console.error("AI Experience Refinement Error:", error);
      res.status(500).json({ error: error.message || "Failed to refine experience" });
    }
  });

  // AI Endpoint: Refine Project Description
  app.post("/api/ai/refine-project", async (req: Request, res: Response) => {
    try {
      const { title, technologies, description } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const prompt = `You are a professional resume resume consultant.
      Refine the description of a projects entry to be impressive, outcome-driven, and highly technical.
      Use bullet points (•) where appropriate or a highly structured summary paragraph.
      Highlight the technologies used effectively.
      
      Project Title: ${title || "N/A"}
      Technologies Used: ${technologies || "N/A"}
      Current Description:
      ${description || "N/A"}

      Return ONLY the refined project description. Avoid conversational introductions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const resultText = response.text?.trim() || "";
      res.json({ result: resultText });
    } catch (error: any) {
      console.error("AI Project Refinement Error:", error);
      res.status(500).json({ error: error.message || "Failed to refine project description" });
    }
  });

  // AI Endpoint: Suggest Skills Based on Job Title
  app.post("/api/ai/suggest-skills", async (req: Request, res: Response) => {
    try {
      const { professionalTitle } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const prompt = `Provide a list of exactly 12 relevant tech skills, software tools, programming languages, or critical soft skills for a professional with the title: "${professionalTitle || "Software Engineer"}".
      Format your response as a single comma-separated list of terms (e.g. React, Node.js, Agile, Cloud Computing).
      Do not include numbering, explanations, or quotes. Just list them.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const skillsArray = text
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 30); // Clean up any malformed responses

      res.json({ result: skillsArray });
    } catch (error: any) {
      console.error("AI Skill Suggestions Error:", error);
      res.status(500).json({ error: error.message || "Failed to suggest skills" });
    }
  });

  // Server health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
  });

  // Serve static files and integrate Vite dev server
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite development server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in Production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Resume Builder full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup failure:", err);
});
