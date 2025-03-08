import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface ContentItem {
  id: string;
  title: string;
  keywords: string[];
  status: 'planned' | 'in-progress' | 'published';
  dueDate: string;
}

const ContentPlanner: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    keywords: '',
    dueDate: '',
  });

  const handleAddItem = () => {
    const item: ContentItem = {
      id: Date.now().toString(),
      title: newItem.title,
      keywords: newItem.keywords.split(',').map(k => k.trim()),
      status: 'planned',
      dueDate: newItem.dueDate,
    };
    setContentItems([...contentItems, item]);
    setNewItem({ title: '', keywords: '', dueDate: '' });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Content Planner
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Content
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
                <TextField
                  label="Keywords (comma-separated)"
                  value={newItem.keywords}
                  onChange={(e) => setNewItem({ ...newItem, keywords: e.target.value })}
                />
                <TextField
                  type="date"
                  label="Due Date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                >
                  Add Content
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Calendar
              </Typography>
              <List>
                {contentItems.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {item.keywords.map((keyword) => (
                            <Chip
                              key={keyword}
                              label={keyword}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          ))}
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentPlanner; 