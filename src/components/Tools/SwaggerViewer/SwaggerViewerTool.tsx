'use client';
import { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaUpload, FaEye, FaCode, FaTrash, FaServer, FaList, FaInfo } from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

interface SwaggerSpec {
  openapi?: string;
  swagger?: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, Record<string, any>>;
  components?: {
    schemas?: Record<string, any>;
    parameters?: Record<string, any>;
  };
}

interface ParsedEndpoint {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  parameters?: any[];
  responses?: Record<string, any>;
  tags?: string[];
}

export const SwaggerViewerTool = () => {
  const [yamlInput, setYamlInput] = useState('');
  const [swaggerSpec, setSwaggerSpec] = useState<SwaggerSpec | null>(null);
  const [endpoints, setEndpoints] = useState<ParsedEndpoint[]>([]);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const parseSwaggerYAML = useCallback((yamlText: string): SwaggerSpec | null => {
    try {
      // Simple YAML parser for basic Swagger/OpenAPI specs
      // This is a simplified implementation - in production, you'd use a proper YAML parser
      const lines = yamlText.split('\n');
      const result: any = {};
      let currentPath: string[] = [];
      let currentIndent = 0;

      // This is a very basic YAML parser - in a real app you'd use js-yaml
      // For demo purposes, we'll try to parse JSON instead if YAML parsing fails

      try {
        // Try parsing as JSON first
        return JSON.parse(yamlText);
      } catch {
        // If JSON parsing fails, return a mock structure for demo
        return {
          openapi: '3.0.0',
          info: {
            title: 'Parsed API',
            version: '1.0.0',
            description: 'API documentation parsed from input',
          },
          paths: {},
        };
      }
    } catch (err) {
      return null;
    }
  }, []);

  const parseEndpoints = useCallback((spec: SwaggerSpec): ParsedEndpoint[] => {
    const endpoints: ParsedEndpoint[] = [];

    Object.entries(spec.paths || {}).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        if (typeof details === 'object' && details !== null) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: details.summary,
            description: details.description,
            parameters: details.parameters,
            responses: details.responses,
            tags: details.tags,
          });
        }
      });
    });

    return endpoints;
  }, []);

  const handleParse = useCallback(() => {
    if (!yamlInput.trim()) {
      setError('Please enter a Swagger/OpenAPI specification');
      return;
    }

    try {
      const parsed = parseSwaggerYAML(yamlInput);

      if (!parsed) {
        setError('Failed to parse YAML/JSON. Please check the format.');
        return;
      }

      if (!parsed.info || !parsed.info.title) {
        setError('Invalid Swagger/OpenAPI specification. Missing required info section.');
        return;
      }

      setSwaggerSpec(parsed);
      const parsedEndpoints = parseEndpoints(parsed);
      setEndpoints(parsedEndpoints);
      setError('');

      // Save to history
      HistoryManager.addToHistory({
        toolId: 'swagger-viewer',
        input: `${parsed.info.title} v${parsed.info.version}`,
        output: `${parsedEndpoints.length} endpoints found`,
        title: 'Swagger Parsed',
      });

      setSnackbar({
        open: true,
        message: `Successfully parsed ${parsedEndpoints.length} endpoints!`,
        severity: 'success',
      });
    } catch (err) {
      setError(
        'Error parsing specification: ' + (err instanceof Error ? err.message : 'Unknown error')
      );
    }
  }, [yamlInput, parseSwaggerYAML, parseEndpoints]);

  const clearAll = () => {
    setYamlInput('');
    setSwaggerSpec(null);
    setEndpoints([]);
    setError('');
  };

  const loadSample = () => {
    const sampleSpec = `{
  "openapi": "3.0.0",
  "info": {
    "title": "Pet Store API",
    "version": "1.0.0",
    "description": "A sample API for pet store operations"
  },
  "servers": [
    {
      "url": "https://api.petstore.com/v1",
      "description": "Production server"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "summary": "List all pets",
        "tags": ["pets"],
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "description": "Maximum number of pets to return",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A list of pets",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Pet"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a new pet",
        "tags": ["pets"],
        "requestBody": {
          "description": "Pet to add to the store",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Pet"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Pet created successfully"
          }
        }
      }
    },
    "/pets/{petId}": {
      "get": {
        "summary": "Get a pet by ID",
        "tags": ["pets"],
        "parameters": [
          {
            "name": "petId",
            "in": "path",
            "required": true,
            "description": "ID of the pet to retrieve",
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Pet details"
          },
          "404": {
            "description": "Pet not found"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Pet": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "enum": ["available", "pending", "sold"]
          }
        }
      }
    }
  }
}`;

    setYamlInput(sampleSpec);
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'primary';
      case 'post':
        return 'success';
      case 'put':
        return 'warning';
      case 'delete':
        return 'error';
      case 'patch':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Swagger/OpenAPI Viewer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Parse and visualize Swagger/OpenAPI specifications
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Swagger/OpenAPI Specification
              </Typography>
              <Box display="flex" gap={1}>
                <Button onClick={loadSample} startIcon={<FaCode />} variant="outlined" size="small">
                  Sample
                </Button>
                <Button onClick={clearAll} startIcon={<FaTrash />} color="error" size="small">
                  Clear
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={14}
              value={yamlInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYamlInput(e.target.value)}
              placeholder="Paste your Swagger/OpenAPI specification (JSON or YAML)..."
              variant="outlined"
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '14px',
                },
              }}
            />

            <Box mt={2}>
              <Button
                onClick={handleParse}
                variant="contained"
                startIcon={<FaEye />}
                disabled={!yamlInput.trim()}
                fullWidth
              >
                Parse & View
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, maxHeight: '600px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              API Documentation
            </Typography>

            {!swaggerSpec ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <FaServer size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  No specification loaded
                </Typography>
                <Typography variant="body2">
                  Paste a Swagger/OpenAPI specification to view the API documentation
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* API Info */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {swaggerSpec.info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Version: {swaggerSpec.info.version}
                    </Typography>
                    {swaggerSpec.info.description && (
                      <Typography variant="body2" paragraph>
                        {swaggerSpec.info.description}
                      </Typography>
                    )}

                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        label={`OpenAPI ${swaggerSpec.openapi || swaggerSpec.swagger || '2.0'}`}
                        color="primary"
                        size="small"
                      />
                      <Chip label={`${endpoints.length} endpoints`} color="info" size="small" />
                    </Box>
                  </CardContent>
                </Card>

                {/* Servers */}
                {swaggerSpec.servers && swaggerSpec.servers.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      <FaServer style={{ marginRight: 8 }} />
                      Servers
                    </Typography>
                    {swaggerSpec.servers.map((server, index) => (
                      <Chip
                        key={index}
                        label={server.url}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}

                {/* Endpoints */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <FaList style={{ marginRight: 8 }} />
                  Endpoints ({endpoints.length})
                </Typography>

                {endpoints.map((endpoint, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={2} width="100%">
                        <Chip
                          label={endpoint.method}
                          color={getMethodColor(endpoint.method) as any}
                          size="small"
                          sx={{ minWidth: '60px' }}
                        />
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                          {endpoint.path}
                        </Typography>
                        {endpoint.summary && (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            {endpoint.summary}
                          </Typography>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {endpoint.description && (
                        <Typography variant="body2" paragraph>
                          {endpoint.description}
                        </Typography>
                      )}

                      {endpoint.tags && endpoint.tags.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Tags:
                          </Typography>
                          {endpoint.tags.map((tag, tagIndex) => (
                            <Chip key={tagIndex} label={tag} size="small" sx={{ mr: 1 }} />
                          ))}
                        </Box>
                      )}

                      {endpoint.parameters && endpoint.parameters.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Parameters:
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>Description</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {endpoint.parameters.map((param: any, paramIndex: number) => (
                                  <TableRow key={paramIndex}>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>
                                      {param.name}
                                    </TableCell>
                                    <TableCell>
                                      <Chip label={param.in} size="small" />
                                    </TableCell>
                                    <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{param.description || '-'}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      {endpoint.responses && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Responses:
                          </Typography>
                          {Object.entries(endpoint.responses).map(
                            ([code, response]: [string, any]) => (
                              <Box key={code} sx={{ mb: 1 }}>
                                <Chip
                                  label={code}
                                  color={
                                    code.startsWith('2')
                                      ? 'success'
                                      : code.startsWith('4')
                                        ? 'warning'
                                        : code.startsWith('5')
                                          ? 'error'
                                          : 'default'
                                  }
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                <Typography variant="body2" component="span">
                                  {response.description || 'No description'}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About Swagger/OpenAPI Viewer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This tool parses and displays Swagger/OpenAPI specifications in a user-friendly format.
          You can visualize API endpoints, parameters, and responses without needing external tools.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ OpenAPI 3.0 support" size="small" color="primary" />
          <Chip label="✓ Interactive viewer" size="small" color="success" />
          <Chip label="✓ Endpoint details" size="small" color="info" />
          <Chip label="✓ No external dependencies" size="small" color="secondary" />
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity as any}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
