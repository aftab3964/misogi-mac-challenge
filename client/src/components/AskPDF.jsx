import React, { useState } from 'react';
import axios from 'axios';

const AskPDF = ({ uploadedFilename }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    console.log('Sending to backend:', {question, filename: uploadedFilename});

    try {
      const res = await axios.post('http://localhost:5000/api/query/ask', { question,
        filename: uploadedFilename
       });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer('❌ Error fetching answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h2 style={{ color: '#34495e' }}>Ask a Question</h2>
      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ padding: '10px', width: '60%', fontSize: '16px' }}
      />
      <br /><br />
      <button
        onClick={handleAsk}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2980b9',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && (
        <div style={{ marginTop: '30px', fontSize: '18px', color: '#2c3e50' }}>
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default AskPDF;
