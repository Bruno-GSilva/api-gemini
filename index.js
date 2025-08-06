const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/translate', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto em inglês não fornecido.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Traduza o seguinte texto do inglês para o português (tradução fiel e natural):\n\n"${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    res.json({ translatedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao acessar API do Gemini', message: err.message });
  }
});

app.listen(port, () => {
  console.log(`API de tradução rodando em http://localhost:${port}`);
});
