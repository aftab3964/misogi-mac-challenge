const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { chunkText } = require('../utils/chunker');
const { getEmbedding } = require('../utils/ollama');
const { addToCollection } = require('../utils/vectorstore');

const uploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  try {
    // Read file buffer
    const dataBuffer = fs.readFileSync(filePath);

    // Extract full text using pdf-parse
    const parsed = await pdfParse(dataBuffer);

    // Store parsed.text in memory for now (we'll chunk + embed in Phase 2)
    req.parsedText = parsed.text;

    //const { chunkText } = require('../utils/chunker');

    const chunks = chunkText(parsed.text, 1000, 200);

    // ✅ Sanitize collection name
    const safeName = req.file.filename.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

    //console.log(`🧠 Total chunks created: ${chunks.length}`);

    //console.log('🧩 First chunk:', chunks[0].slice(0, 300)); // Optional preview

    for (let i = 0; i < chunks.length; i++) {
     const chunk = chunks[i];
     const embedding = await getEmbedding(chunk);
     const metadata = {
       filename: req.file.filename,
       chunkIndex: i,
       uploadDate: new Date(),
      };

      await addToCollection({
      id: `${safeName}_chunk_${i}`,
      text: chunk,
      embedding,
      metadata: {
      filename: req.file.filename,
      collection: safeName, // <- important
      chunkIndex: i,
      uploadDate: new Date()
      }
    });

      //console.log(`✅ Chunk ${i} embedded and stored`);
}

    // Send only metadata to frontend (no raw text)
    res.status(200).json({
      message: 'File uploaded and parsed successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        totalPages: parsed.numpages,
        uploadDate: new Date()
      },
      // Add preview info for frontend polish
      preview: {
        filename: req.file.originalname,
        sizeKB: (req.file.size / 1024).toFixed(2),
        firstChunk: chunks[0] ? chunks[0].slice(0, 300) : ''
      }
    });

  } catch (error) {
    console.error('❌ PDF parse error:', error);
    res.status(500).json({ message: 'Failed to parse PDF', error });
  }
};

module.exports = { uploadPdf };
