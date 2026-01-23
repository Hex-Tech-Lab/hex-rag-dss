'use client';

import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, List, ListItem, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useRouter } from 'next/navigation';
import { askQuestion } from './actions';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const router = useRouter();

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    
    const userQuery = query;
    setQuery('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);

    try {
      const result = await askQuestion(userQuery);
      if (result.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${result.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: result.content || 'No response generated.' }]);
      }
    } catch (chatError) {
      console.error('Chat error:', chatError);
      setMessages(prev => [...prev, { role: 'assistant', content: 'An unexpected error occurred during retrieval.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || query;
    if (!lastUserMsg) return;
    router.push(`/compare?topic=${encodeURIComponent(lastUserMsg)}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '90vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Decision Support Chat
      </Typography>

      <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <List sx={{ width: '100%' }}>
          {messages.map((msg, i) => (
            <ListItem key={i} sx={{ 
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              px: 0,
              alignItems: 'flex-start'
            }}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                color: msg.role === 'user' ? 'white' : 'text.primary',
                maxWidth: '85%',
                borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                boxShadow: 1
              }}>
                <Box sx={{ '& p': { m: 0 } }}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <Typography variant="body1">{msg.content}</Typography>
                  )}
                </Box>
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <ListItem sx={{ justifyContent: 'flex-start', px: 0 }}>
              <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: '20px 20px 20px 0', boxShadow: 1 }}>
                <CircularProgress size={20} />
              </Paper>
            </ListItem>
          )}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about the Freedom System or OpenSpec..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            const nativeEvent = e.nativeEvent as KeyboardEvent;
            const isComposing = nativeEvent.isComposing || (nativeEvent as any).keyCode === 229;
            if (isComposing || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
            e.preventDefault();
            handleSend();
          }}
          size="small"
          disabled={loading}
        />
        <Button variant="contained" onClick={handleSend} endIcon={<SendIcon />} disabled={loading}>
          Send
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCompare} endIcon={<CompareArrowsIcon />} disabled={loading}>
          Compare
        </Button>
      </Box>
    </Container>
  );
}
