import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box, Button, Typography, CircularProgress, Paper, Alert, Divider
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const UploadPDF = ({ setUploadedFilename }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const pdf = acceptedFiles[0];
    if (pdf && pdf.type === 'application/pdf') {
      setFile(pdf);
      setUploadStatus('');
      setError('');
    } else {
      setFile(null);
      setError('❌ Only PDF files are allowed');
      setUploadStatus('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    setError('');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/pdf/upload', formData);
      setUploadStatus(`✅ Uploaded: ${res.data.file.filename}`);
      setUploadedFilename(res.data.file.filename);
    } catch (err) {
      setUploadStatus('');
      setError('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            p: 3,
            border: '2px dashed #90caf9',
            borderRadius: 2,
            cursor: 'pointer',
            background: isDragActive ? '#e3f2fd' : '#fafbfc'
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body1" color="primary">
            {isDragActive ? 'Drop your PDF here...' : 'Drag & drop a PDF here, or click to select'}
          </Typography>
        </Box>
        {file && (
          <Box mt={3} display="flex" alignItems="center" justifyContent="center" gap={1}>
            <InsertDriveFileIcon color="primary" />
            <Typography variant="subtitle2">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ mt: 3, minWidth: 140 }}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload PDF'}
        </Button>
        {uploadStatus && (
          <Alert severity="success" sx={{ mt: 2 }}>{uploadStatus}</Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}
        <Divider sx={{ mt: 3 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Only PDF files are supported. Max file size: 10MB.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UploadPDF;
