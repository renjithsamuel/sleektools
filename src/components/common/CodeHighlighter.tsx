'use client';
import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FaCopy } from 'react-icons/fa';

interface CodeHighlighterProps {
  code: string;
  language: string;
  showCopyButton?: boolean;
  onCopy?: () => void;
  maxHeight?: string;
}

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language,
  showCopyButton = true,
  onCopy,
  maxHeight = '500px',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      if (onCopy) onCopy();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      {showCopyButton && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 1,
          }}
        >
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={handleCopy} size="small" sx={{ color: 'white' }}>
              <FaCopy />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <SyntaxHighlighter
        language={language}
        style={isDark ? atomOneDark : atomOneLight}
        customStyle={{
          margin: 0,
          padding: '16px',
          fontSize: '14px',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          maxHeight: maxHeight,
          overflow: 'auto',
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
        }}
        showLineNumbers={code.split('\n').length > 5}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

// Specific highlighters for different types
export const JSONHighlighter: React.FC<Omit<CodeHighlighterProps, 'language'>> = props => (
  <CodeHighlighter {...props} language="json" />
);

export const XMLHighlighter: React.FC<Omit<CodeHighlighterProps, 'language'>> = props => (
  <CodeHighlighter {...props} language="xml" />
);

export const SQLHighlighter: React.FC<Omit<CodeHighlighterProps, 'language'>> = props => (
  <CodeHighlighter {...props} language="sql" />
);

export const YAMLHighlighter: React.FC<Omit<CodeHighlighterProps, 'language'>> = props => (
  <CodeHighlighter {...props} language="yaml" />
);
