const { OpenAI } = require('openai');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY?.startsWith("github_pat_") || process.env.OPENAI_API_KEY?.startsWith("ghp_")
    ? "https://models.inference.ai.azure.com" 
    : undefined
});

const promptPath = path.join(__dirname, '../prompts/prompt_general.txt');
const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

exports.analyzeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Si sessionId est absent, on peut traiter le payload directement pour le test (MVP)
    let session;
    let description, expectedBehavior, actualBehavior, hypothesesList, testsList;

    if (sessionId) {
      session = await prisma.debugSession.findUnique({
        where: { id: sessionId },
        include: { hypotheses: true, tests: true }
      });
      if (!session) return res.status(404).json({ error: "Session non trouvée" });

      description = session.description;
      expectedBehavior = session.expectedBehavior;
      actualBehavior = session.actualBehavior;
      hypothesesList = session.hypotheses.map(h => h.content).join(', ');
      testsList = session.tests.map(t => t.description + ' -> ' + t.result).join(', ');
    } else {
      // Fallback si pas de DB pour test immédiat
      const data = req.body;
      description = data.description;
      expectedBehavior = data.expectedBehavior;
      actualBehavior = data.actualBehavior;
      hypothesesList = data.hypothesis || "Aucune";
      testsList = data.testDescription ? data.testDescription + " -> " + (data.testResult || "?") : "Aucun";
    }

    const userPrompt = `
      Description: ${description}
      Attendu: ${expectedBehavior}
      Réel: ${actualBehavior}
      Hypothèses: ${hypothesesList}
      Tests: ${testsList}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const analysisData = JSON.parse(response.choices[0].message.content);

    // Si on a un sessionId en DB, on sauvegarde l'analyse
    if (session) {
      const analysis = await prisma.analysis.create({
        data: {
          sessionId: session.id,
          issuesDetected: analysisData.issuesDetected,
          suggestions: analysisData.suggestions
        }
      });
      return res.json({ success: true, analysis });
    }

    // Sinon, on renvoie juste les données (Mock DB)
    res.json({ success: true, analysis: analysisData });

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse" });
  }
};
