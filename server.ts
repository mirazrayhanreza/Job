import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes FIRST

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Generate AI SEO Configuration
app.post("/api/seo/generate", async (req: express.Request, res: express.Response) => {
  try {
    const { pageType, title, description, additionalContext } = req.body;

    if (!pageType || !title) {
      res.status(400).json({ error: "Missing required fields: pageType and title are required." });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      res.status(503).json({ 
        error: "Gemini API key is missing. Please configure GEMINI_API_KEY in Settings > Secrets.",
        details: e.message 
      });
      return;
    }

    const systemPrompt = `You are an expert AI SEO Specialist and Search Engine Architect for 'Probashi Jobs Pro' (an overseas jobs portal for Bangladeshis).
Analyze the input title, description, and context to generate professional search-engine-optimized values.
Page Type: ${pageType}
Input Title: ${title}
Input Description/Content: ${description || ''}
Context: ${additionalContext || ''}

Generate detailed SEO metadata, structural metrics, keyword calculations, and a high-quality Schema.org JSON-LD string as structured data for this page.
The Schema.org JSON-LD must be valid and conform to the page type (e.g., JobPosting for 'job', Organization for 'company', BlogPosting for 'blog', WebSite for 'home').

Additionally, perform content optimization:
- Provide an "improvedTitle": an optimized, highly click-worthy version of the page or job title.
- Provide an "improvedDescription": a copy-optimized, highly engaging, and grammatically perfect version of the description, with strategic keyword placement.
- Provide an "faqList": 2 to 4 relevant FAQs (frequently asked questions with answers) tailored to this specific page or job posting, in Bengali (or English if context is English).
- Provide "internalLinks": 2 to 3 recommendations for logical internal links (Anchor Text, Target URL, and justification).

Return a JSON object matching this schema exactly:
{
  "seoTitle": "A string limited to 60 characters with keyword rich terms",
  "metaDescription": "A click-worthy snippet limited to 160 characters",
  "metaKeywords": ["array", "of", "5-8", "keywords"],
  "slug": "url-friendly-lowercase-slug-with-hyphens",
  "ogTitle": "Attractive social title",
  "ogDescription": "Social meta description",
  "twitterCard": "summary_large_image",
  "imageAltText": "Alt text for the main representative image",
  "canonicalUrl": "/relative/canonical/url/based/on/slug",
  "schemaJson": "A complete, valid string containing <script type=\\"application/ld+json\\"> format JSON-LD representation (DO NOT escape backslashes incorrectly; make it valid stringified JSON)",
  "seoScore": 85, // estimated score 0-100
  "readabilityScore": 90, // score 0-100
  "keywordDensity": [
    { "keyword": "keyword1", "count": 3, "percent": 1.5 }
  ],
  "missingTags": ["H1 tag empty", "etc"], // or empty array
  "imageSeoCheck": "Passed", // 'Passed' | 'Warnings' | 'Critical'
  "brokenLinkCheck": "Passed", // 'Passed' | 'Failed'
  "improvedTitle": "Optimized, click-worthy CTR title",
  "improvedDescription": "Optimized description content formatted for excellent readability",
  "faqList": [
    { "question": "What is the requirement?", "answer": "Answer details" }
  ],
  "internalLinks": [
    { "anchorText": "ইতালি স্পন্সর ভিসা", "url": "/country/italy", "reason": "Links seekers to Italy job category" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "seoTitle", 
            "metaDescription", 
            "metaKeywords", 
            "slug", 
            "ogTitle", 
            "ogDescription", 
            "twitterCard", 
            "imageAltText", 
            "canonicalUrl", 
            "schemaJson",
            "seoScore",
            "readabilityScore",
            "keywordDensity",
            "missingTags",
            "imageSeoCheck",
            "brokenLinkCheck",
            "improvedTitle",
            "improvedDescription",
            "faqList",
            "internalLinks"
          ],
          properties: {
            seoTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            metaKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            slug: { type: Type.STRING },
            ogTitle: { type: Type.STRING },
            ogDescription: { type: Type.STRING },
            twitterCard: { type: Type.STRING },
            imageAltText: { type: Type.STRING },
            canonicalUrl: { type: Type.STRING },
            schemaJson: { type: Type.STRING },
            seoScore: { type: Type.INTEGER },
            readabilityScore: { type: Type.INTEGER },
            keywordDensity: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["keyword", "count", "percent"],
                properties: {
                  keyword: { type: Type.STRING },
                  count: { type: Type.INTEGER },
                  percent: { type: Type.NUMBER }
                }
              }
            },
            missingTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            imageSeoCheck: { type: Type.STRING },
            brokenLinkCheck: { type: Type.STRING },
            improvedTitle: { type: Type.STRING },
            improvedDescription: { type: Type.STRING },
            faqList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["question", "answer"],
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                }
              }
            },
            internalLinks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["anchorText", "url", "reason"],
                properties: {
                  anchorText: { type: Type.STRING },
                  url: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (err: any) {
    console.error("SEO Generator API Error:", err);
    res.status(500).json({ 
      error: "Failed to generate SEO metadata.", 
      details: err.message 
    });
  }
});

// Vite middleware or production static files setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
