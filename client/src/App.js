import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadPDF from './components/UploadPDF';
import AskPDF from './components/AskPDF';
import { Box, Typography, Container, Paper } from '@mui/material';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [uploadedFilename, setUploadedFilename] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(res => setMessage(res.data))
      .catch(err => setMessage('❌ Error connecting to backend'));
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h3" color="primary" fontWeight="bold" align="center" gutterBottom>
          PDF Q&A ChatBot
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
          Backend says: <strong>{message}</strong>
        </Typography>
      </Paper>
      <Typography variant="h5" color="primary.dark" align="center" sx={{ mb: 3 }}>
        Upload Your PDF
      </Typography>
      <UploadPDF setUploadedFilename={setUploadedFilename} />
      <AskPDF uploadedFilename={uploadedFilename} />
    </Container>
  );
}

export default App;
