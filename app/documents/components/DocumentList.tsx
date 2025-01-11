'use client';

import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { documentApi } from '@/api/documentApi';

interface Document {
  id: number;
  name: string;
  type: string;
  size: number;
  category: string;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface DocumentListProps {
  documents: Document[];
  onDelete?: (id: number) => void;
  onView?: (document: Document) => void;
}

export default function DocumentList({ documents, onDelete, onView }: DocumentListProps) {
  const confirm = useConfirm();
  const toast = useToast();
  const [deleteDocument] = documentApi.useDeleteDocumentMutation();

  const handleDelete = async (id: number) => {
    try {
      if (await confirm('Are you sure you want to delete this document?')) {
        await deleteDocument(id).unwrap();
        toast.success('Document deleted successfully');
        onDelete?.(id);
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Uploaded By</TableCell>
            <TableCell>Uploaded At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <Typography variant="body2" noWrap>
                  {document.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={document.type} size="small" />
              </TableCell>
              <TableCell>{formatFileSize(document.size)}</TableCell>
              <TableCell>
                <Chip label={document.category} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={document.status}
                  size="small"
                  color={document.status === 'Active' ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell>{document.uploadedBy}</TableCell>
              <TableCell>{formatDate(document.uploadedAt)}</TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onView?.(document)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(document.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 