'use client';
import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Snackbar,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { FaUpload, FaDownload, FaImage, FaCompress, FaTrash, FaEye } from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

interface CompressedImage {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  quality: number;
  format: string;
  compressionRatio: number;
}

export const ImageCompressorTool = () => {
  const [image, setImage] = useState<CompressedImage | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<'webp' | 'jpeg' | 'png'>('webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setSnackbar({ open: true, message: 'Please select a valid image file', severity: 'error' });
        return;
      }

      setIsProcessing(true);

      try {
        const compressedImage = await compressImage(file, quality, format);
        setImage(compressedImage);

        // Save to history
        HistoryManager.addToHistory({
          toolId: 'image-compressor',
          input: `${file.name} (${formatFileSize(file.size)})`,
          output: `Compressed to ${formatFileSize(compressedImage.compressedSize)} (${compressedImage.compressionRatio.toFixed(1)}% reduction)`,
          title: 'Image Compressed',
        });

        setSnackbar({ open: true, message: 'Image compressed successfully!', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to compress image', severity: 'error' });
      } finally {
        setIsProcessing(false);
      }
    },
    [quality, format]
  );

  const compressImage = useCallback(
    (file: File, quality: number, format: string): Promise<CompressedImage> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            reject(new Error('Canvas not available'));
            return;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0);

          // Convert to blob
          canvas.toBlob(
            blob => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              const compressionRatio = ((file.size - blob.size) / file.size) * 100;

              resolve({
                originalFile: file,
                compressedBlob: blob,
                originalSize: file.size,
                compressedSize: blob.size,
                quality: quality,
                format: format,
                compressionRatio: Math.max(0, compressionRatio),
              });
            },
            `image/${format}`,
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const recompressImage = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    try {
      const newCompressed = await compressImage(image.originalFile, quality, format);
      setImage(newCompressed);
      setSnackbar({ open: true, message: 'Image recompressed successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to recompress image', severity: 'error' });
    } finally {
      setIsProcessing(false);
    }
  }, [image, quality, format, compressImage]);

  const downloadImage = () => {
    if (!image) return;

    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.originalFile.name.split('.')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'Image downloaded!', severity: 'success' });
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Image Compressor
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Reduce image file sizes while maintaining quality
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Upload Image
            </Typography>

            {!image ? (
              <Box
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                  border: '2px dashed',
                  borderColor: dragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: dragActive ? 'action.hover' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  Drop image here or click to upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports JPEG, PNG, WebP, and other common formats
                </Typography>
              </Box>
            ) : (
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {image.originalFile.name}
                    </Typography>
                    <Button onClick={clearImage} color="error" startIcon={<FaTrash />} size="small">
                      Remove
                    </Button>
                  </Box>

                  <Box display="flex" gap={2} mb={2}>
                    <Chip
                      label={`Original: ${formatFileSize(image.originalSize)}`}
                      color="default"
                      size="small"
                    />
                    <Chip
                      label={`Compressed: ${formatFileSize(image.compressedSize)}`}
                      color="success"
                      size="small"
                    />
                    <Chip
                      label={`${image.compressionRatio.toFixed(1)}% smaller`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      onClick={downloadImage}
                      variant="contained"
                      startIcon={<FaDownload />}
                      size="small"
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outlined"
                      startIcon={<FaUpload />}
                      size="small"
                    >
                      New Image
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />

            {isProcessing && (
              <Box mt={2}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Processing image...
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Settings */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Compression Settings
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">Output Format</FormLabel>
              <RadioGroup
                value={format}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormat(e.target.value as any)
                }
                row
              >
                <FormControlLabel value="webp" control={<Radio />} label="WebP (Best)" />
                <FormControlLabel value="jpeg" control={<Radio />} label="JPEG" />
                <FormControlLabel value="png" control={<Radio />} label="PNG" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Quality: {Math.round(quality * 100)}%</FormLabel>
              <Slider
                value={quality}
                onChange={(_: any, newValue: any) => setQuality(newValue)}
                min={0.1}
                max={1}
                step={0.05}
                marks={[
                  { value: 0.1, label: '10%' },
                  { value: 0.5, label: '50%' },
                  { value: 0.8, label: '80%' },
                  { value: 1, label: '100%' },
                ]}
                disabled={isProcessing}
              />
            </FormControl>

            {image && (
              <Button
                onClick={recompressImage}
                variant="contained"
                startIcon={<FaCompress />}
                fullWidth
                sx={{ mt: 2 }}
                disabled={isProcessing}
              >
                Recompress with New Settings
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Preview
            </Typography>

            {!image ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <FaImage size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  No image selected
                </Typography>
                <Typography variant="body2">
                  Upload an image to see the compression preview
                </Typography>
              </Box>
            ) : (
              <Box>
                <img
                  src={URL.createObjectURL(image.compressedBlob)}
                  alt="Compressed preview"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Compression Results
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Original Size:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatFileSize(image.originalSize)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Compressed Size:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatFileSize(image.compressedSize)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Savings:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                    {image.compressionRatio.toFixed(1)}%
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Format:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {format.toUpperCase()} @ {Math.round(quality * 100)}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About Image Compression
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Image compression reduces file sizes by removing unnecessary data and optimizing encoding.
          WebP format typically provides the best compression while maintaining visual quality.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ WebP format support" size="small" color="primary" />
          <Chip label="✓ Adjustable quality" size="small" color="success" />
          <Chip label="✓ Instant preview" size="small" color="info" />
          <Chip label="✓ No upload required" size="small" color="secondary" />
        </Box>
      </Paper>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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
