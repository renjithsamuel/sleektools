'use client';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { FaTrash, FaHistory, FaCopy, FaSearch, FaFilter } from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';
import { HistoryItem } from '../../../types/tools';
import { TOOLS } from '../../../constants/tools';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    setHistory(HistoryManager.getHistory());
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.output.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTool = selectedTool === 'all' || item.toolId === selectedTool;
    return matchesSearch && matchesTool;
  });

  const handleDeleteItem = (id: string) => {
    HistoryManager.deleteHistoryItem(id);
    setHistory(HistoryManager.getHistory());
  };

  const handleClearAll = () => {
    HistoryManager.clearHistory();
    setHistory([]);
    setClearDialogOpen(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getToolInfo = (toolId: string) => {
    const tool = TOOLS.find(tool => tool.id === toolId);
    return (
      tool || {
        name: toolId,
        category: 'Unknown',
        route: '#',
      }
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toolStats = history.reduce(
    (acc, item) => {
      acc[item.toolId] = (acc[item.toolId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <FaHistory style={{ marginRight: 16 }} />
          History
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          View and manage your tool usage history
        </Typography>
        <Chip label={`${history.length} items in history`} color="primary" sx={{ mb: 2 }} />
      </Box>

      {/* Stats */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Usage Statistics
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(toolStats).map(([toolId, count]) => {
            const tool = getToolInfo(toolId);
            return (
              <Grid item key={toolId}>
                <Chip label={`${tool.name}: ${count}`} color="secondary" size="small" />
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <FaSearch style={{ marginRight: 8, opacity: 0.5 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Filter by tool"
              value={selectedTool}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedTool(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="all">All Tools</option>
              {TOOLS.map(tool => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => setClearDialogOpen(true)}
              disabled={history.length === 0}
            >
              Clear All
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* History List */}
      <Paper elevation={3} sx={{ p: 0 }}>
        {filteredHistory.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <FaHistory size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              {history.length === 0 ? 'No history yet' : 'No items match your search'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {history.length === 0
                ? 'Start using tools to see your history here'
                : 'Try adjusting your search criteria'}
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredHistory.map((item, index) => {
              const tool = getToolInfo(item.toolId);
              return (
                <div key={item.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Chip
                            label={tool.name}
                            color="primary"
                            size="small"
                            component={Link}
                            href={tool.route || '#'}
                            clickable
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(item.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            <strong>Input:</strong>{' '}
                            {item.input.length > 100
                              ? item.input.substring(0, 100) + '...'
                              : item.input}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Output:</strong>{' '}
                            {item.output.length > 100
                              ? item.output.substring(0, 100) + '...'
                              : item.output}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleCopy(item.output)}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <FaCopy />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteItem(item.id)}
                        color="error"
                        size="small"
                      >
                        <FaTrash />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredHistory.length - 1 && <Divider />}
                </div>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Clear All Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear All History</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All {history.length} history items will be permanently
            deleted.
          </Alert>
          <Typography>Are you sure you want to clear all history?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
