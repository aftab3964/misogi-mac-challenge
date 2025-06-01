const axios = require('axios');
const { pipeline } = require('@xenova/transformers');

let embedder = null;

async function initEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

async function getEmbedding(text) {
  const pipe = await initEmbedder();
  const output = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function getAnswer(prompt) {
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'gemma:2b',
    prompt,
    stream: false
  });
  return response.data.response?.trim() || '';
}

module.exports = { getEmbedding, getAnswer };
