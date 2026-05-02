const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY?.startsWith("github_pat_") || process.env.OPENAI_API_KEY?.startsWith("ghp_")
    ? "https://models.inference.ai.azure.com" 
    : undefined
});

const promptPath = path.join(__dirname, '../prompts/prompt_chat.txt');
const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

exports.continueChat = async (req, res) => {
  try {
    const { sessionId, messages, context } = req.body;
    
    // Si on n'a pas de DB connectée, on utilise les messages passés dans la requête
    // context contient la description initiale du bug pour l'IA
    
    const formattedMessages = [
      { role: "system", content: systemPrompt + `\n\nContexte initial du bug soumis :\n${JSON.stringify(context, null, 2)}` },
      ...messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
    });

    const aiMessage = response.choices[0].message.content;

    // Si on veut sauvegarder en DB
    if (sessionId) {
      const userMsg = messages[messages.length - 1];
      await prisma.message.create({ data: { sessionId, role: userMsg.role, content: userMsg.content }});
      await prisma.message.create({ data: { sessionId, role: 'assistant', content: aiMessage }});
    }

    res.json({ success: true, message: aiMessage });

  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    res.status(500).json({ error: "Erreur lors de la discussion" });
  }
};
