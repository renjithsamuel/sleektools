'use client';
import { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  FaCopy,
  FaDownload,
  FaRandom,
  FaTrash,
  FaPlay,
  FaParagraph,
  FaListUl,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'at',
  'vero',
  'eos',
  'accusamus',
  'accusantium',
  'doloremque',
  'laudantium',
  'totam',
  'rem',
  'aperiam',
  'eaque',
  'ipsa',
  'quae',
  'ab',
  'illo',
  'inventore',
  'veritatis',
  'et',
  'quasi',
  'architecto',
  'beatae',
  'vitae',
  'dicta',
  'explicabo',
  'nemo',
  'ipsam',
  'quia',
  'voluptas',
  'aspernatur',
  'aut',
  'odit',
  'fugit',
  'sed',
  'consequuntur',
  'magni',
  'dolores',
  'ratione',
  'sequi',
  'nesciunt',
  'neque',
  'porro',
  'quisquam',
  'dolorem',
  'adipisci',
  'numquam',
  'eius',
  'modi',
  'tempora',
  'incidunt',
  'magnam',
  'quaerat',
  'voluptatem',
];

const ALTERNATIVE_TEXTS = {
  cicero: {
    name: 'Cicero (Original)',
    words: [
      'sed',
      'ut',
      'perspiciatis',
      'unde',
      'omnis',
      'iste',
      'natus',
      'error',
      'sit',
      'voluptatem',
      'accusantium',
      'doloremque',
      'laudantium',
      'totam',
      'rem',
      'aperiam',
      'eaque',
      'ipsa',
      'quae',
      'ab',
      'illo',
      'inventore',
      'veritatis',
      'et',
      'quasi',
      'architecto',
      'beatae',
      'vitae',
      'dicta',
      'sunt',
      'explicabo',
    ],
  },
  hipster: {
    name: 'Hipster Ipsum',
    words: [
      'artisan',
      'craft',
      'beer',
      'organic',
      'sustainable',
      'fixie',
      'beard',
      'mustache',
      'vinyl',
      'retro',
      'vintage',
      'brooklyn',
      'kale',
      'chips',
      'quinoa',
      'kombucha',
      'yoga',
      'meditation',
      'chakra',
      'vegan',
      'gluten-free',
      'farm-to-table',
      'locally-sourced',
      'aesthetic',
      'minimalist',
      'authentic',
    ],
  },
  pirate: {
    name: 'Pirate Ipsum',
    words: [
      'ahoy',
      'matey',
      'treasure',
      'chest',
      'parrot',
      'cutlass',
      'rum',
      'ship',
      'sail',
      'anchor',
      'captain',
      'crew',
      'plank',
      'jolly',
      'roger',
      'scurvy',
      'landlubber',
      'buccaneer',
      'doubloon',
      'island',
      'map',
      'compass',
      'storm',
      'waves',
      'mast',
      'deck',
    ],
  },
  zombie: {
    name: 'Zombie Ipsum',
    words: [
      'zombie',
      'brain',
      'undead',
      'apocalypse',
      'virus',
      'infection',
      'bite',
      'horde',
      'survival',
      'outbreak',
      'decay',
      'shamble',
      'groan',
      'feed',
      'hunger',
      'plague',
      'quarantine',
      'barricade',
      'shelter',
      'escape',
      'weapons',
      'fight',
      'resist',
      'cure',
      'hope',
      'fear',
    ],
  },
};

type GenerationType = 'words' | 'sentences' | 'paragraphs';
type TextStyle = 'lorem' | 'cicero' | 'hipster' | 'pirate' | 'zombie';

export const LoremIpsumGenerator = () => {
  const [type, setType] = useState<GenerationType>('paragraphs');
  const [count, setCount] = useState(3);
  const [textStyle, setTextStyle] = useState<TextStyle>('lorem');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const getRandomWord = useCallback((wordList: string[]): string => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  }, []);

  const getWordList = useCallback((style: TextStyle): string[] => {
    if (style === 'lorem') return LOREM_WORDS;
    return ALTERNATIVE_TEXTS[style as keyof typeof ALTERNATIVE_TEXTS]?.words || LOREM_WORDS;
  }, []);

  const generateWords = useCallback(
    (count: number, style: TextStyle, startWithLorem: boolean): string => {
      const wordList = getWordList(style);
      const words: string[] = [];

      if (startWithLorem && style === 'lorem') {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }

      for (let i = words.length; i < count; i++) {
        words.push(getRandomWord(wordList));
      }

      return words.join(' ');
    },
    [getWordList, getRandomWord]
  );

  const generateSentences = useCallback(
    (count: number, style: TextStyle, startWithLorem: boolean): string => {
      const sentences: string[] = [];

      for (let i = 0; i < count; i++) {
        const wordsInSentence = Math.floor(Math.random() * 15) + 8; // 8-22 words per sentence
        const isFirstSentence = i === 0 && startWithLorem && style === 'lorem';
        const words = generateWords(wordsInSentence, style, isFirstSentence);
        const sentence = words.charAt(0).toUpperCase() + words.slice(1) + '.';
        sentences.push(sentence);
      }

      return sentences.join(' ');
    },
    [generateWords]
  );

  const generateParagraphs = useCallback(
    (count: number, style: TextStyle, startWithLorem: boolean): string => {
      const paragraphs: string[] = [];

      for (let i = 0; i < count; i++) {
        const sentencesInParagraph = Math.floor(Math.random() * 6) + 4; // 4-9 sentences per paragraph
        const isFirstParagraph = i === 0 && startWithLorem && style === 'lorem';
        const paragraph = generateSentences(sentencesInParagraph, style, isFirstParagraph);
        paragraphs.push(paragraph);
      }

      return paragraphs.join('\n\n');
    },
    [generateSentences]
  );

  const handleGenerate = useCallback(() => {
    if (count <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid count', severity: 'error' });
      return;
    }

    let result = '';

    switch (type) {
      case 'words':
        result = generateWords(count, textStyle, startWithLorem);
        break;
      case 'sentences':
        result = generateSentences(count, textStyle, startWithLorem);
        break;
      case 'paragraphs':
        result = generateParagraphs(count, textStyle, startWithLorem);
        break;
    }

    setGeneratedText(result);

    // Save to history
    HistoryManager.addToHistory({
      toolId: 'lorem-generator',
      input: `${count} ${type} (${textStyle})`,
      output: result.substring(0, 100) + (result.length > 100 ? '...' : ''),
      title: 'Lorem Ipsum Generated',
    });

    setSnackbar({ open: true, message: `Generated ${count} ${type}!`, severity: 'success' });
  }, [
    type,
    count,
    textStyle,
    startWithLorem,
    generateWords,
    generateSentences,
    generateParagraphs,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy text', severity: 'error' });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum-${type}-${count}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'Text downloaded!', severity: 'success' });
  };

  const clearText = () => {
    setGeneratedText('');
  };

  const getStats = () => {
    if (!generatedText) return null;

    const words = generatedText.split(/\s+/).length;
    const characters = generatedText.length;
    const charactersNoSpaces = generatedText.replace(/\s/g, '').length;
    const sentences = generatedText.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = generatedText.split(/\n\s*\n/).filter(p => p.trim()).length;

    return { words, characters, charactersNoSpaces, sentences, paragraphs };
  };

  const stats = getStats();

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
          Lorem Ipsum Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate placeholder text for your designs and layouts
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
          <Chip label="✓ Multiple Styles" size="small" color="primary" />
          <Chip label="✓ Custom Length" size="small" color="success" />
          <Chip label="✓ Word Count Stats" size="small" color="info" />
          <Chip label="✓ Instant Copy" size="small" color="warning" />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Generation Options
            </Typography>

            <Box display="flex" flexDirection="column" gap={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e: any) => setType(e.target.value as GenerationType)}
                >
                  <MenuItem value="words">Words</MenuItem>
                  <MenuItem value="sentences">Sentences</MenuItem>
                  <MenuItem value="paragraphs">Paragraphs</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Count"
                value={count}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCount(parseInt(e.target.value) || 1)
                }
                inputProps={{ min: 1, max: 100 }}
              />

              <FormControl fullWidth>
                <InputLabel>Text Style</InputLabel>
                <Select
                  value={textStyle}
                  label="Text Style"
                  onChange={(e: any) => setTextStyle(e.target.value as TextStyle)}
                >
                  <MenuItem value="lorem">Lorem Ipsum (Classic)</MenuItem>
                  <MenuItem value="cicero">Cicero (Original)</MenuItem>
                  <MenuItem value="hipster">Hipster Ipsum</MenuItem>
                  <MenuItem value="pirate">Pirate Ipsum</MenuItem>
                  <MenuItem value="zombie">Zombie Ipsum</MenuItem>
                </Select>
              </FormControl>

              {textStyle === 'lorem' && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={startWithLorem}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setStartWithLorem(e.target.checked)
                      }
                    />
                  }
                  label="Start with 'Lorem ipsum...'"
                />
              )}

              <Button
                variant="contained"
                startIcon={<FaPlay />}
                onClick={handleGenerate}
                fullWidth
                size="large"
              >
                Generate Text
              </Button>

              {generatedText && (
                <Box display="flex" gap={1}>
                  <Button
                    startIcon={<FaCopy />}
                    onClick={handleCopy}
                    variant="outlined"
                    size="small"
                  >
                    Copy
                  </Button>
                  <Button
                    startIcon={<FaDownload />}
                    onClick={handleDownload}
                    variant="outlined"
                    size="small"
                  >
                    Download
                  </Button>
                  <IconButton onClick={clearText} color="error" size="small">
                    <FaTrash />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Text Statistics */}
          {stats && (
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                <FaListUl style={{ marginRight: 8 }} />
                Text Statistics
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Characters:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.characters.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Characters (no spaces):</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.charactersNoSpaces.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Words:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.words.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Sentences:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.sentences.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Paragraphs:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.paragraphs.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Generated Text Output */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, minHeight: '600px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <FaParagraph style={{ marginRight: 8 }} />
                Generated Text
              </Typography>
              {generatedText && <Chip label={`${count} ${type}`} color="primary" size="small" />}
            </Box>

            {!generatedText ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaRandom size={64} style={{ marginBottom: 24, opacity: 0.3 }} />
                <Typography variant="h5" gutterBottom>
                  Generate Lorem Ipsum Text
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose your options and click "Generate Text" to create placeholder content
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'grey.200',
                  fontFamily: 'Georgia, serif',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  maxHeight: '500px',
                  overflow: 'auto',
                  whiteSpace: 'pre-line',
                }}
              >
                {generatedText}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About Lorem Ipsum
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Lorem Ipsum is placeholder text commonly used in the printing and typesetting industry. It
          has been the industry's standard dummy text since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Industry standard since 1500s" size="small" color="primary" />
          <Chip label="✓ Neutral content focus" size="small" color="success" />
          <Chip label="✓ Professional layouts" size="small" color="info" />
          <Chip label="✓ Design placeholder" size="small" color="secondary" />
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
