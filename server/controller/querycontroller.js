const { getEmbedding, getAnswer } = require('../utils/ollama'); // custom embedding + Ollama
const { ChromaClient } = require('chromadb');

const chroma = new ChromaClient({ baseUrl: 'http://localhost:8000' });
const COLLECTION_NAME = 'pdf_chunks';

async function askQuestion(req, res) {
  const { question, filename } = req.body;

  if (!question || !filename) {
    return res.status(400).json({ message: 'question or filename is missing' });
  }

  try {
    // 1. Embed the user's question locally using transformers
    const embedding = await getEmbedding(question);

    // 2. Search Chroma for relevant chunks
    const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const collection = await chroma.getOrCreateCollection({ name: safeName });

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: 10,
      where: {
      collection: safeName,
      },
    });

    const retrievedChunks = results.documents[0];

    console.log('🧠 Retrieved Chunks for Question:', question);


    // 3. Build prompt context
    const context = retrievedChunks.join('\n\n');

    console.log('📄 Chunks used as context:\n', context);

    const prompt = `
You are an intelligent assistant. Use ONLY the context below to answer the question.

Context:
${context}

Question: ${question}
Answer:
`;

    // 4. Use Ollama's Gemma 2B for local answer generation
    const answer = await getAnswer(prompt);

    // Return answer and the source chunks for frontend highlighting
    res.status(200).json({
      answer,
      sources: retrievedChunks.map(chunk => ({
        text: chunk,
        // Optionally, highlight the first 5 words of the question if present in chunk
        highlight: question.split(' ').slice(0, 5).find(word => chunk.includes(word)) || ''
      }))
    });

  } catch (err) {
    console.error('❌ Error answering question:', err);
    res.status(500).json({ message: 'Error answering question', error: err.message });
  }
}


module.exports = { askQuestion };
