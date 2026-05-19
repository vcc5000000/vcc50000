import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PRINCIPAL_PROMPT_ID =
  process.env.OPENAI_PRINCIPAL_PROMPT_ID ||
  "pmpt_6a0bba6d1fd4819786666591bafceb9e08591b2d4759ba51";

const PRINCIPAL_PROMPT_VERSION =
  process.env.OPENAI_PRINCIPAL_PROMPT_VERSION || "1";

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.post("/api/asesor-principal", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar OPENAI_API_KEY en el archivo .env.",
      });
    }

    const message = String(req.body?.message || "").trim();
    const topic = String(req.body?.topic || message || "Consulta de inversión").trim();
    const previousResponseId = req.body?.previousResponseId || undefined;

    if (!message) {
      return res.status(400).json({
        error: "El mensaje es obligatorio.",
      });
    }

    const response = await openai.responses.create({
      prompt: {
        id: PRINCIPAL_PROMPT_ID,
        version: PRINCIPAL_PROMPT_VERSION,
        variables: {
          topic,
        },
      },
      input: message,
      previous_response_id: previousResponseId,
    });

    res.json({
      responseId: response.id,
      reply: response.output_text || "El agente no devolvió texto.",
    });
  } catch (error) {
    console.error("Error invoking Asesor Principal.ai:", error);

    res.status(500).json({
      error:
        error?.message ||
        "Error invocando Asesor Principal.ai desde OpenAI.",
    });
  }
});

app.listen(port, () => {
  console.log(`VCC50000 web running at http://localhost:${port}`);
});
