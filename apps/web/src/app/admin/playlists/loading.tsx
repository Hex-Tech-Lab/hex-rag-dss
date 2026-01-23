import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function Loading() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        YouTube Playlists
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select the playlists you want to index into hex-rag-dss.
      </Typography>

      <Box>
        <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 4 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItem key={i} divider>
              <ListItemAvatar>
                <Skeleton variant="rounded" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText 
                primary={<Skeleton variant="text" width="60%" />} 
                secondary={<Skeleton variant="text" width="30%" />} 
              />
            </ListItem>
          ))}
        </List>
        
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
      </Box>
    </Container>
  );
}
