'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FaUsers,
  FaTools,
  FaChartBar,
  FaClock,
  FaServer,
  FaMemory,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from 'react-icons/fa';
import {
  mockToolUsages,
  mockAppUsage,
  mockSystemHealth,
  mockDailyUsage,
  mockCategoryUsage,
} from '../../data/AdminMockData';
import { IToolUsage, IAppUsage, ISystemHealth } from '../../types/Admin';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${
        color === 'primary'
          ? '#667eea 0%, #764ba2 100%'
          : color === 'success'
            ? '#56ab2f 0%, #a8e6cf 100%'
            : color === 'warning'
              ? '#f093fb 0%, #f5576c 100%'
              : color === 'error'
                ? '#ff416c 0%, #ff4b2b 100%'
                : '#667eea 0%, #764ba2 100%'
      })`,
      color: 'white',
      height: '100%',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ fontSize: '2.5rem', opacity: 0.8 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export const AdminDashboard = () => {
  const [toolUsages, setToolUsages] = useState<IToolUsage[]>(mockToolUsages);
  const [appUsage] = useState<IAppUsage>(mockAppUsage);
  const [systemHealth] = useState<ISystemHealth>(mockSystemHealth);
  const [selectedTool, setSelectedTool] = useState<IToolUsage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToolToggle = (toolId: string) => {
    setToolUsages(prev =>
      prev.map(tool => (tool.id === toolId ? { ...tool, isEnabled: !tool.isEnabled } : tool))
    );
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'critical':
        return <FaTimesCircle />;
      default:
        return <FaCheckCircle />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Monitor application usage, manage tools, and system health
        </Typography>
      </Box>

      {/* Metrics Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value={appUsage.totalUsers.toLocaleString()}
            icon={<FaUsers />}
            color="primary"
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tool Usages"
            value={appUsage.totalToolUsages.toLocaleString()}
            icon={<FaTools />}
            color="success"
            subtitle="Total executions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Daily Active Users"
            value={appUsage.activeUsers.toLocaleString()}
            icon={<FaChartBar />}
            color="warning"
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Session"
            value={`${appUsage.averageSessionDuration} min`}
            icon={<FaClock />}
            color="error"
            subtitle="Duration"
          />
        </Grid>
      </Grid>

      {/* System Health */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  System Health
                </Typography>
                <Chip
                  icon={getStatusIcon(systemHealth.status)}
                  label={systemHealth.status.toUpperCase()}
                  color={getStatusColor(systemHealth.status) as any}
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Uptime</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {systemHealth.uptime}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(systemHealth.uptime)}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Memory Usage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {systemHealth.memoryUsage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={systemHealth.memoryUsage}
                  color={
                    systemHealth.memoryUsage > 80
                      ? 'error'
                      : systemHealth.memoryUsage > 60
                        ? 'warning'
                        : 'success'
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">CPU Usage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {systemHealth.cpuUsage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={systemHealth.cpuUsage}
                  color={
                    systemHealth.cpuUsage > 80
                      ? 'error'
                      : systemHealth.cpuUsage > 60
                        ? 'warning'
                        : 'success'
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} sx={{ bgcolor: 'primary.50', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      {systemHealth.responseTime}ms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} sx={{ bgcolor: 'success.50', borderRadius: 2 }}>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                      {systemHealth.errorRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Error Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Usage by Category
              </Typography>
              <Box>
                {mockCategoryUsage.map((category, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {category.category}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {category.usage.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (category.usage / Math.max(...mockCategoryUsage.map(c => c.usage))) * 100
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: category.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tools Management */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tools Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {toolUsages.filter(t => t.isEnabled).length} of {toolUsages.length} tools enabled
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: 1, borderColor: 'grey.200' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tool Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Usage Count</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Used</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolUsages
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .map(tool => (
                    <TableRow key={tool.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {tool.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tool.category}
                          size="small"
                          sx={{
                            bgcolor:
                              mockCategoryUsage.find(
                                c => c.category.toLowerCase() === tool.category
                              )?.color || 'grey',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tool.usageCount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {tool.lastUsed.toLocaleDateString()}{' '}
                          {tool.lastUsed.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={tool.isEnabled}
                              onChange={() => handleToolToggle(tool.id)}
                              color="success"
                            />
                          }
                          label={tool.isEnabled ? 'Enabled' : 'Disabled'}
                          sx={{ m: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setSelectedTool(tool);
                                setDialogOpen(true);
                              }}
                            >
                              <FaEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Tool">
                            <IconButton size="small" color="warning">
                              <FaEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Tool">
                            <IconButton size="small" color="error">
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Tool Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tool Details - {selectedTool?.name}</DialogTitle>
        <DialogContent>
          {selectedTool && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tool ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedTool.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedTool.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Usage
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedTool.usageCount.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedTool.isEnabled ? 'Enabled' : 'Disabled'}
                  color={selectedTool.isEnabled ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Last Used
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedTool.lastUsed.toLocaleDateString()} at{' '}
                  {selectedTool.lastUsed.toLocaleTimeString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Edit Tool
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
