function chunkText(text, maxChunkLength = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChunkLength;
    if (end > text.length) {
      end = text.length;
    }

    chunks.push(text.slice(start, end));
    start += maxChunkLength - overlap;
  }

  return chunks;
}

module.exports = { chunkText };
