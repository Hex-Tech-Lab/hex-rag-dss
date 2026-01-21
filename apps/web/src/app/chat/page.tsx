'use client';

import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const router = useRouter();

  const handleSend = () => {
    if (!query.trim()) return;
    
    setMessages([...messages, { role: 'user', content: query }]);
    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've analyzed your query about "${query}". Would you like to see a side-by-side comparison matrix for the systems mentioned?` 
      }]);
    }, 1000);
    setQuery('');
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
              px: 0
            }}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                color: msg.role === 'user' ? 'white' : 'text.primary',
                maxWidth: '80%',
                borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                boxShadow: 1
              }}>
                <Typography variant="body1">{msg.content}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about the Freedom System or OpenSpec..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          size="small"
        />
        <Button variant="contained" onClick={handleSend} endIcon={<SendIcon />}>
          Send
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCompare} endIcon={<CompareArrowsIcon />}>
          Compare
        </Button>
      </Box>
    </Container>
  );
}
