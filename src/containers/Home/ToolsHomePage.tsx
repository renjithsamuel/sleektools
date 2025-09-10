'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Fade,
  Button,
} from '@mui/material';
import {
  FaSearch,
  FaCode,
  FaCheckCircle,
  FaExchangeAlt,
  FaRandom,
  FaTools,
  FaStar,
  FaCubes,
  FaEquals,
  FaLock,
  FaDatabase,
  FaEye,
  FaFileCode,
  FaFileAlt,
  FaKey,
  FaCompress,
  FaIdCard,
  FaClock,
  FaPaintBrush,
  FaParagraph,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { TOOLS, TOOL_CATEGORIES, getFeaturedTools, searchTools } from '../../constants/tools';
import { Tool } from '../../types/tools';

const categoryIconMap = {
  FaCode,
  FaCheckCircle,
  FaExchangeAlt,
  FaRandom,
  FaTools,
};

const toolIconMap = {
  FaCubes,
  FaEquals,
  FaLock,
  FaDatabase,
  FaCheckCircle,
  FaEye,
  FaFileCode,
  FaFileAlt,
  FaKey,
  FaCompress,
  FaIdCard,
  FaClock,
  FaCode,
  FaPaintBrush,
  FaParagraph,
};

interface ToolsHomePageProps {
  initialCategory?: string;
}

export const ToolsHomePage = ({ initialCategory }: ToolsHomePageProps = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const router = useRouter();

  const filteredTools = searchQuery
    ? searchTools(searchQuery)
    : selectedCategory
      ? TOOLS.filter(tool => tool.category.id === selectedCategory)
      : TOOLS;

  const featuredTools = getFeaturedTools();

  const handleToolClick = (tool: Tool) => {
    router.push(tool.route);
  };

  const getToolIcon = (iconName: string) => {
    const Icon = toolIconMap[iconName as keyof typeof toolIconMap] || FaCode;
    return Icon;
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header Section */}
      <Box textAlign="center" mb={{ xs: 6, md: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 3,
          }}
        >
          SleekTools
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: '700px',
            mx: 'auto',
            mb: 4,
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
          }}
        >
          Professional developer tools for formatting, validation, conversion, and more. All
          processing happens in your browser - your data never leaves your device.
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch style={{ color: '#6B7280' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 2,
                },
                '&.Mui-focused': {
                  boxShadow: 3,
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Category Filters */}
      <Box display="flex" justifyContent="center" gap={2} mb={{ xs: 6, md: 8 }} flexWrap="wrap">
        <Chip
          label="All Tools"
          onClick={() => {
            setSelectedCategory(null);
            setSearchQuery('');
          }}
          variant={selectedCategory === null && !searchQuery ? 'filled' : 'outlined'}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1,
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
            transition: 'all 0.2s ease',
          }}
        />
        {TOOL_CATEGORIES.map(category => {
          const IconComponent = categoryIconMap[category.icon as keyof typeof categoryIconMap];
          return (
            <Chip
              key={category.id}
              label={category.name}
              icon={<IconComponent />}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery('');
              }}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: category.color,
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                transition: 'all 0.2s ease',
              }}
            />
          );
        })}
      </Box>

      {/* Featured Tools Section */}
      {!searchQuery && !selectedCategory && (
        <Box mb={{ xs: 6, md: 10 }}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <FaStar style={{ color: '#F59E0B', fontSize: '1.5rem' }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Featured Tools
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 3, sm: 4, md: 4, lg: 5 }}>
            {featuredTools.map((tool, index) => {
              const IconComponent = getToolIcon(tool.icon);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      border: 1,
                      borderColor: 'divider',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        borderColor: tool.category.color,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: tool.category.color,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleToolClick(tool)}
                      sx={{ height: '100%', p: 3 }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.1)'
                                  : `${tool.category.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: (theme: any) =>
                                theme.palette.mode === 'dark' ? '#fff' : tool.category.color,
                            }}
                          >
                            <IconComponent size={28} />
                          </Box>
                          <FaStar size={18} style={{ color: '#F59E0B' }} />
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                          {tool.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, lineHeight: 1.5 }}
                        >
                          {tool.description}
                        </Typography>
                        <Chip
                          label={tool.category.name}
                          size="small"
                          sx={{
                            backgroundColor: `${tool.category.color}15`,
                            color: tool.category.color,
                            fontWeight: 500,
                            border: 1,
                            borderColor: `${tool.category.color}30`,
                          }}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Tools Grid */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          {searchQuery
            ? `Search Results (${filteredTools.length})`
            : selectedCategory
              ? TOOL_CATEGORIES.find(cat => cat.id === selectedCategory)?.name
              : 'All Tools'}
        </Typography>

        <Grid container spacing={{ xs: 3, sm: 4, md: 4, lg: 5 }}>
          {filteredTools.map((tool, index) => {
            const IconComponent = getToolIcon(tool.icon);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                      borderColor: tool.category.color,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: tool.category.color,
                      opacity: 0.8,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleToolClick(tool)}
                    sx={{ height: '100%', p: 3 }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          backgroundColor: (theme: any) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.1)'
                              : `${tool.category.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: (theme: any) =>
                            theme.palette.mode === 'dark' ? '#fff' : tool.category.color,
                          mb: 2,
                        }}
                      >
                        <IconComponent size={24} />
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                        {tool.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.5 }}
                      >
                        {tool.description}
                      </Typography>
                      <Chip
                        label={tool.category.name}
                        size="small"
                        sx={{
                          backgroundColor: `${tool.category.color}15`,
                          color: tool.category.color,
                          fontWeight: 500,
                          border: 1,
                          borderColor: `${tool.category.color}30`,
                        }}
                      />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredTools.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No tools found matching your search.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              sx={{ borderRadius: 3 }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};
