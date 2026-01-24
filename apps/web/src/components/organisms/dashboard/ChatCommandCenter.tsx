'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, CircularProgress, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TerminalIcon from '@mui/icons-material/Terminal';
import ReactMarkdown from 'react-markdown';
import { askQuestion } from '@/app/chat/actions';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatCommandCenter() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'An unexpected error occurred during retrieval.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TerminalIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Command Center
        </Typography>
      </Box>

      <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', bgcolor: '#f8f9fa', borderRadius: 2 }}>
        <List data-testid="chat-messages">
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
              Ready for query. Ask about methodology comparisons or system status.
            </Typography>
          )}
          {messages.map((msg, i) => (
            <ListItem key={i} data-testid="chat-message" sx={{ 
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              px: 0,
              alignItems: 'flex-start'
            }}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: msg.role === 'user' ? 'primary.dark' : 'white',
                color: msg.role === 'user' ? 'white' : 'text.primary',
                maxWidth: '90%',
                borderRadius: 2,
                boxShadow: 1
              }}>
                <Box sx={{ '& p': { m: 0 }, '& code': { bgcolor: '#eee', p: '2px 4px', borderRadius: '4px' } }}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <Typography variant="body2">{msg.content}</Typography>
                  )}
                </Box>
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter query..."
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
          sx={{ bgcolor: 'white' }}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}
