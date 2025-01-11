'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';

interface Document {
  id: number;
  name: string;
  type: string;
  contentType: string;
  size: number;
  description?: string;
  category: string;
  status: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  ocrContent?: string;
  uploadedBy: string;
  uploadedAt: string;
  processedAt?: string;
  processedBy?: string;
  tags?: string;
  url: string;
}

interface DocumentPreviewProps {
  open: boolean;
  onClose: () => void;
  document: Document;
}

export default function DocumentPreview({ open, onClose, document }: DocumentPreviewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isImage = document.contentType?.startsWith('image/');
  const isPDF = document.contentType === 'application/pdf';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Document Preview</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Document Info */}
          <Box>
            <Typography variant="h6">{document.name}</Typography>
            <Box display="flex" gap={1} mt={1}>
              <Chip label={document.type} size="small" />
              <Chip label={document.category} size="small" />
              <Chip
                label={document.status}
                size="small"
                color={document.status === 'Active' ? 'success' : 'default'}
              />
            </Box>
          </Box>

          <Divider />

          {/* Document Details */}
          <Box display="grid" gridTemplateColumns="auto 1fr" gap={2} alignItems="start">
            <Typography color="textSecondary">Size:</Typography>
            <Typography>{formatFileSize(document.size)}</Typography>

            <Typography color="textSecondary">Uploaded By:</Typography>
            <Typography>{document.uploadedBy}</Typography>

            <Typography color="textSecondary">Uploaded At:</Typography>
            <Typography>{formatDate(document.uploadedAt)}</Typography>

            {document.description && (
              <>
                <Typography color="textSecondary">Description:</Typography>
                <Typography>{document.description}</Typography>
              </>
            )}

            {document.ocrContent && (
              <>
                <Typography color="textSecondary">OCR Content:</Typography>
                <Typography
                  sx={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {document.ocrContent}
                </Typography>
              </>
            )}
          </Box>

          <Divider />

          {/* Document Preview */}
          <Box
            sx={{
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {isImage ? (
              <img
                src={document.url}
                alt={document.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : isPDF ? (
              <iframe
                src={document.url}
                title={document.name}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            ) : (
              <Typography color="textSecondary">
                Preview not available for this file type
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          Download
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 