const { ChromaClient } = require('chromadb');

const chroma = new ChromaClient();

async function getOrCreateCollection(name) {
  const collection = await chroma.getOrCreateCollection({
    name, // <-- use the dynamic name!
    embeddingFunction: null, // we embed manually
  });
  return collection;
}

async function addToCollection({ id, text, embedding, metadata }) {
  const collection = await getOrCreateCollection(metadata.collection);

  await collection.add({
    ids: [id],
    embeddings: [embedding],
    documents: [text],
    metadatas: [metadata],
  });
}

module.exports = { addToCollection, getOrCreateCollection };
