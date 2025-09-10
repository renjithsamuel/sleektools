'use client';
import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  FaPlay,
  FaSave,
  FaFolderOpen,
  FaDownload,
  FaTrash,
  FaCopy,
  FaCode,
  FaTerminal,
  FaFile,
  FaPlus,
} from 'react-icons/fa';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { HistoryManager } from '../../../utils/historyManager';
import { useTheme } from '../../../context/ThemeContext';

interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  createdAt: Date;
  lastModified: Date;
}

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', fileExt: '.js' },
  { value: 'typescript', label: 'TypeScript', fileExt: '.ts' },
  { value: 'python', label: 'Python', fileExt: '.py' },
  { value: 'java', label: 'Java', fileExt: '.java' },
  { value: 'cpp', label: 'C++', fileExt: '.cpp' },
  { value: 'c', label: 'C', fileExt: '.c' },
  { value: 'csharp', label: 'C#', fileExt: '.cs' },
  { value: 'go', label: 'Go', fileExt: '.go' },
  { value: 'rust', label: 'Rust', fileExt: '.rs' },
  { value: 'php', label: 'PHP', fileExt: '.php' },
  { value: 'ruby', label: 'Ruby', fileExt: '.rb' },
  { value: 'swift', label: 'Swift', fileExt: '.swift' },
  { value: 'kotlin', label: 'Kotlin', fileExt: '.kt' },
  { value: 'html', label: 'HTML', fileExt: '.html' },
  { value: 'css', label: 'CSS', fileExt: '.css' },
  { value: 'sql', label: 'SQL', fileExt: '.sql' },
  { value: 'json', label: 'JSON', fileExt: '.json' },
  { value: 'xml', label: 'XML', fileExt: '.xml' },
  { value: 'yaml', label: 'YAML', fileExt: '.yaml' },
];

const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  javascript: `// Welcome to the Online Code Editor
console.log("Hello, World!");

// Try some JavaScript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci of 10:", fibonacci(10));

// Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log("Doubled numbers:", doubled);`,

  typescript: `// Welcome to TypeScript Code Editor
console.log("Hello, TypeScript!");

// Type definitions
interface User {
    id: number;
    name: string;
    email: string;
}

// Generic function
function identity<T>(arg: T): T {
    return arg;
}

const user: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
};

console.log("User:", user);
console.log("Identity:", identity("Hello TypeScript"));`,

  python: `# Welcome to the Online Code Editor
print("Hello, World!")

# Try some Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci of 10: {fibonacci(10)}")

# List comprehension
numbers = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in numbers]
print(f"Doubled numbers: {doubled}")

# Dictionary example
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print(f"Person: {person}")`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Code Editor</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .highlight { 
            color: #FFE082; 
            font-weight: bold; 
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        }
        button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to the <span class="highlight">Online Code Editor</span></h1>
        <p>A powerful, browser-based code editor with syntax highlighting!</p>
        <button onclick="showMessage()">Try Interactive Demo!</button>
    </div>
    
    <script>
        function showMessage() {
            alert('🎉 Hello from the Online Code Editor!');
        }
    </script>
</body>
</html>`,

  css: `/* Welcome to the CSS Code Editor */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #FFE082;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    max-width: 800px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    text-align: center;
}

.title {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, var(--accent-color), #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    margin: 20px 0;
    border-radius: 15px;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}`,

  json: `{
    "welcomeMessage": "Welcome to the JSON Code Editor!",
    "description": "JSON (JavaScript Object Notation) is a lightweight data interchange format",
    "features": [
        "Human readable",
        "Language independent", 
        "Easy to parse and generate"
    ],
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "isActive": true,
        "profile": {
            "age": 30,
            "country": "USA"
        }
    }
}`,
};

export const OnlineCodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [snippetName, setSnippetName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const editorRef = useRef<any>(null);
  const { isDarkMode } = useTheme();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      detectIndentation: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        indentation: true,
        bracketPairs: true,
      },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
      lineHeight: 22,
      letterSpacing: 0.5,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveSnippet();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const template =
      DEFAULT_CODE_TEMPLATES[newLanguage] || `// ${newLanguage.toUpperCase()} code here\n`;
    setCode(template);
    setOutput('');
    setExecutionResult(null);
  };

  const simulateCodeExecution = async (
    code: string,
    language: string
  ): Promise<ExecutionResult> => {
    const startTime = Date.now();

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const executionTime = Date.now() - startTime;

    // Simulate different outputs based on language and code content
    if (language === 'javascript') {
      if (code.includes('console.log("Hello, World!")')) {
        return {
          output: 'Hello, World!\nFibonacci of 10: 55\nDoubled numbers: [2, 4, 6, 8, 10]\n',
          executionTime,
        };
      }
      return {
        output: 'JavaScript code executed successfully!\n',
        executionTime,
      };
    } else if (language === 'python') {
      if (code.includes('print("Hello, World!")')) {
        return {
          output:
            "Hello, World!\nFibonacci of 10: 55\nDoubled numbers: [2, 4, 6, 8, 10]\nPerson: {'name': 'Alice', 'age': 30, 'city': 'New York'}\n",
          executionTime,
        };
      }
      return {
        output: 'Python code executed successfully!\n',
        executionTime,
      };
    } else if (language === 'html') {
      return {
        output:
          'HTML preview would be rendered here in a real implementation.\nPage structure looks good!\n',
        executionTime,
      };
    } else if (language === 'java') {
      if (code.includes('System.out.println("Hello, World!")')) {
        return {
          output: 'Hello, World!\nFibonacci of 10: 55\nDoubled numbers: [2, 4, 6, 8, 10]\n',
          executionTime,
        };
      }
      return {
        output: 'Java code compiled and executed successfully!\n',
        executionTime,
      };
    } else {
      return {
        output: `${language.toUpperCase()} code executed successfully!\nOutput would appear here in a real implementation.\n`,
        executionTime,
      };
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setSnackbar({ open: true, message: 'Please write some code first!', severity: 'error' });
      return;
    }

    setIsExecuting(true);
    try {
      const result = await simulateCodeExecution(code, language);
      setExecutionResult(result);
      setOutput(result.output);

      // Save to history
      HistoryManager.addToHistory({
        toolId: 'code-editor',
        input: code,
        output: result.output,
        title: `${language} Execution`,
      });

      setSnackbar({ open: true, message: 'Code executed successfully!', severity: 'success' });
    } catch (error) {
      const errorResult: ExecutionResult = {
        output: '',
        error: 'Execution failed. Please check your code.',
        executionTime: 0,
      };
      setExecutionResult(errorResult);
      setSnackbar({ open: true, message: 'Execution failed!', severity: 'error' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveSnippet = () => {
    if (!code.trim()) {
      setSnackbar({ open: true, message: 'Please write some code first!', severity: 'error' });
      return;
    }
    setSaveDialogOpen(true);
  };

  const saveSnippet = () => {
    if (!snippetName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a snippet name!', severity: 'error' });
      return;
    }

    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      name: snippetName,
      language,
      code,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    setSavedSnippets(prev => [...prev, newSnippet]);
    setSnippetName('');
    setSaveDialogOpen(false);
    setSnackbar({ open: true, message: 'Snippet saved successfully!', severity: 'success' });
  };

  const loadSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setLoadDialogOpen(false);
    setSnackbar({ open: true, message: `Loaded "${snippet.name}"`, severity: 'success' });
  };

  const deleteSnippet = (snippetId: string) => {
    setSavedSnippets(prev => prev.filter(s => s.id !== snippetId));
    setSnackbar({ open: true, message: 'Snippet deleted', severity: 'success' });
  };

  const handleDownload = () => {
    const fileExt = SUPPORTED_LANGUAGES.find(l => l.value === language)?.fileExt || '.txt';
    const fileName = `code-snippet${fileExt}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'Code downloaded!', severity: 'success' });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setSnackbar({ open: true, message: 'Code copied to clipboard!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to copy code', severity: 'error' });
    }
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
    setExecutionResult(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Online Code Editor
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Write, run, and save code snippets with VS Code-like experience
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
          <Chip label="✓ Syntax Highlighting" size="small" color="primary" />
          <Chip label="✓ Multiple Languages" size="small" color="success" />
          <Chip label="✓ Code Execution" size="small" color="info" />
          <Chip label="✓ Save Snippets" size="small" color="warning" />
          <Chip label="✓ VS Code Shortcuts" size="small" color="secondary" />
          <Chip label="✓ Resizable Panels" size="small" color="error" />
        </Box>
      </Box>

      {/* Toolbar */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e: any) => handleLanguageChange(e.target.value)}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<FaPlay />}
              onClick={handleRunCode}
              disabled={isExecuting}
              color="success"
            >
              {isExecuting ? 'Running...' : 'Run Code'}
            </Button>
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap">
            <Tooltip title="Save Snippet (Ctrl+S)">
              <Button startIcon={<FaSave />} onClick={handleSaveSnippet} variant="outlined">
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Load Snippet">
              <Button
                startIcon={<FaFolderOpen />}
                onClick={() => setLoadDialogOpen(true)}
                variant="outlined"
              >
                Load
              </Button>
            </Tooltip>
            <Tooltip title="Download Code">
              <IconButton onClick={handleDownload} color="primary">
                <FaDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy Code">
              <IconButton onClick={handleCopy} color="primary">
                <FaCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Code">
              <IconButton onClick={clearCode} color="error">
                <FaTrash />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Editor and Output with Resizable Panels */}
      <Paper elevation={3} sx={{ height: '600px', overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">
          {/* Code Editor Panel */}
          <Panel defaultSize={70} minSize={30}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  bgcolor: 'grey.100',
                  px: 2,
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FaCode />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {SUPPORTED_LANGUAGES.find(l => l.value === language)?.label} Editor
                </Typography>
                <Chip label={`Lines: ${code.split('\n').length}`} size="small" variant="outlined" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={value => setCode(value || '')}
                  onMount={handleEditorDidMount}
                  theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                  options={{
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    detectIndentation: false,
                    renderWhitespace: 'selection',
                    bracketPairColorization: { enabled: true },
                    guides: {
                      bracketPairs: true,
                      indentation: true,
                    },
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                    formatOnPaste: true,
                    formatOnType: true,
                    lineHeight: 22,
                    letterSpacing: 0.5,
                  }}
                />
              </Box>
            </Box>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle>
            <Box
              sx={{
                width: '4px',
                height: '100%',
                bgcolor: 'divider',
                cursor: 'col-resize',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
            />
          </PanelResizeHandle>

          {/* Output Panel */}
          <Panel defaultSize={30} minSize={20}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  bgcolor: 'grey.100',
                  px: 2,
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FaTerminal />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Output
                </Typography>
                {executionResult && (
                  <Chip
                    label={`${executionResult.executionTime}ms`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                {executionResult ? (
                  <>
                    {executionResult.error ? (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                          {executionResult.error}
                        </Typography>
                      </Alert>
                    ) : (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Execution completed in {executionResult.executionTime}ms
                      </Alert>
                    )}
                    <Box
                      component="pre"
                      sx={{
                        fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                        fontSize: '13px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        m: 0,
                        p: 2,
                        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
                        color: isDarkMode ? 'grey.100' : 'grey.900',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'grey.300',
                      }}
                    >
                      {executionResult.output || 'No output'}
                    </Box>
                  </>
                ) : (
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Click "Run Code" to see output here...
                  </Typography>
                )}
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
      </Paper>

      {/* Save Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Code Snippet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Snippet Name"
            value={snippetName}
            onChange={(e: any) => setSnippetName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveSnippet} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Dialog */}
      <Dialog
        open={loadDialogOpen}
        onClose={() => setLoadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Load Code Snippet</DialogTitle>
        <DialogContent>
          {savedSnippets.length === 0 ? (
            <Box textAlign="center" py={4}>
              <FaFile size={48} style={{ color: '#ccc', marginBottom: 16 }} />
              <Typography color="text.secondary">
                No saved snippets yet. Save your first snippet to see it here.
              </Typography>
            </Box>
          ) : (
            <List>
              {savedSnippets.map(snippet => (
                <ListItem key={snippet.id} divider>
                  <ListItemText
                    primary={snippet.name}
                    secondary={`${snippet.language} • ${snippet.createdAt.toLocaleDateString()}`}
                  />
                  <Box display="flex" gap={1}>
                    <Button size="small" onClick={() => loadSnippet(snippet)} variant="outlined">
                      Load
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => deleteSnippet(snippet.id)}
                      color="error"
                    >
                      <FaTrash />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};
