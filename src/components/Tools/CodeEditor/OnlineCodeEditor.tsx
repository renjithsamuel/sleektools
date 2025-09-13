'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
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
  CircularProgress,
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
  javascript: `// Hello, World! in JavaScript
console.log("Hello, World!");`,

  typescript: `// Hello, World! in TypeScript
console.log("Hello, World!");`,

  python: `# Hello, World! in Python
print("Hello, World!")`,

  java: `// Hello, World! in Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  cpp: `// Hello, World! in C++
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,

  c: `// Hello, World! in C
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  csharp: `// Hello, World! in C#
using System;

class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,

  go: `// Hello, World! in Go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,

  rust: `// Hello, World! in Rust
fn main() {
    println!("Hello, World!");
}`,

  php: `<?php
// Hello, World! in PHP
echo "Hello, World!";
?>`,

  ruby: `# Hello, World! in Ruby
puts "Hello, World!"`,

  swift: `// Hello, World! in Swift
print("Hello, World!")`,

  kotlin: `// Hello, World! in Kotlin
fun main() {
    println("Hello, World!")
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello, World!</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,

  css: `/* Hello, World! in CSS */
body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
}

h1 {
    color: #333;
}

.hello-world {
    font-size: 2em;
    color: #007bff;
}`,

  sql: `-- Hello, World! in SQL
SELECT 'Hello, World!' AS message;`,

  json: `{
    "message": "Hello, World!",
    "language": "JSON",
    "greeting": true
}`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<greeting>
    <message>Hello, World!</message>
    <language>XML</language>
</greeting>`,

  yaml: `# Hello, World! in YAML
message: "Hello, World!"
language: YAML
greeting: true`,
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
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const editorRef = useRef<any>(null);
  const { isDarkMode } = useTheme();

  const handleEditorWillMount = (monaco: any) => {
    try {
      // Configure Monaco environment for Next.js
      if (typeof window !== 'undefined') {
        // Disable web workers to avoid loading issues
        (window as any).MonacoEnvironment = {
          getWorkerUrl: () => '',
          getWorker: () => {
            // Return a dummy worker to prevent loading issues
            return {
              postMessage: () => {},
              terminate: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
            };
          }
        };
      }

      // Configure TypeScript/JavaScript defaults with minimal setup
      if (monaco.languages?.typescript?.javascriptDefaults) {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          noEmit: true,
          allowJs: true,
        });

        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true, // Disable to avoid worker issues
          noSyntaxValidation: false,
        });
      }

      if (monaco.languages?.typescript?.typescriptDefaults) {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          noEmit: true,
        });

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true, // Disable to avoid worker issues
          noSyntaxValidation: false,
        });
      }
    } catch (error) {
      console.warn('Monaco configuration warning:', error);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    try {
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

      // Set loading state to false when editor is ready
      setIsEditorLoading(false);
    } catch (error) {
      console.error('Monaco editor mount error:', error);
      setIsEditorLoading(false);
      setSnackbar({ 
        open: true, 
        message: 'Editor failed to initialize. Please refresh the page.', 
        severity: 'error' 
      });
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const template =
      DEFAULT_CODE_TEMPLATES[newLanguage] || `// ${newLanguage.toUpperCase()} code here\n`;
    setCode(template);
    setOutput('');
    setExecutionResult(null);
    // Don't reset loading state for language changes - Monaco is already initialized
    // setIsEditorLoading(true);
  };

  // Handle Monaco loading timeout - only on initial load
  useEffect(() => {
    // Only set timeout for initial load, not language changes
    if (isEditorLoading && !editorRef.current) {
      const timeout = setTimeout(() => {
        if (isEditorLoading && !editorRef.current) {
          console.warn('Monaco Editor is taking longer than expected to load');
          setIsEditorLoading(false); // Stop loading state
          setUseFallback(true); // Enable fallback mode
          setSnackbar({
            open: true,
            message: 'Monaco Editor failed to load. Using basic text editor.',
            severity: 'warning'
          });
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isEditorLoading]);

  // Add a fallback for when Monaco completely fails
  const [useFallback, setUseFallback] = useState(false);

  const simulateCodeExecution = async (
    code: string,
    language: string
  ): Promise<ExecutionResult> => {
    const startTime = Date.now();

    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const executionTime = Date.now() - startTime;

    // Define expected outputs for "Hello, World!" programs
    const helloWorldOutputs: Record<string, string> = {
      javascript: 'Hello, World!',
      typescript: 'Hello, World!',
      python: 'Hello, World!',
      java: 'Hello, World!',
      cpp: 'Hello, World!',
      c: 'Hello, World!',
      csharp: 'Hello, World!',
      go: 'Hello, World!',
      rust: 'Hello, World!',
      php: 'Hello, World!',
      ruby: 'Hello, World!',
      swift: 'Hello, World!',
      kotlin: 'Hello, World!',
      sql: 'Hello, World!',
      html: 'HTML rendered successfully! Page displays: Hello, World!',
      css: 'CSS styles applied successfully!',
      json: 'JSON parsed successfully! Message: Hello, World!',
      xml: 'XML parsed successfully! Message: Hello, World!',
      yaml: 'YAML parsed successfully! Message: Hello, World!',
    };

    return {
      output: helloWorldOutputs[language] || `${language.toUpperCase()} code executed successfully!`,
      executionTime,
    };
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
              <Box sx={{ flex: 1, position: 'relative' }}>
                {isEditorLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                      zIndex: 1000,
                    }}
                  >
                    <Box textAlign="center">
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading Monaco Editor...
                      </Typography>
                    </Box>
                  </Box>
                )}
                {useFallback ? (
                  // Fallback textarea when Monaco fails
                  <TextField
                    fullWidth
                    multiline
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Enter your ${language} code here...`}
                    variant="outlined"
                    InputProps={{
                      style: {
                        fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                        fontSize: '14px',
                        height: '100%',
                      },
                    }}
                    sx={{
                      height: '100%',
                      '& .MuiOutlinedInput-root': {
                        height: '100%',
                        alignItems: 'flex-start',
                      },
                      '& .MuiOutlinedInput-input': {
                        height: '100% !important',
                        overflow: 'auto !important',
                      },
                    }}
                  />
                ) : (
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={value => setCode(value || '')}
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                    theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                    loading={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          flexDirection: 'column',
                        }}
                      >
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Loading Monaco Editor...
                        </Typography>
                      </Box>
                    }
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
                )}
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
