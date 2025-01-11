'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useToast } from '@/hooks/useToast';
import { documentApi } from '@/api/documentApi';

interface DocumentUploadProps {
  open: boolean;
  onClose: () => void;
  relatedEntityType?: string;
  relatedEntityId?: number;
  uploadedBy: string;
}

const DOCUMENT_CATEGORIES = [
  'Contract',
  'Report',
  'Invoice',
  'Medical Record',
  'Identification',
  'Other',
];

export default function DocumentUpload({
  open,
  onClose,
  relatedEntityType,
  relatedEntityId,
  uploadedBy,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [uploadDocument] = documentApi.useUploadDocumentMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !category) {
      toast.error('Please select a file and category');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('uploadedBy', uploadedBy);

    if (relatedEntityType) {
      formData.append('relatedEntityType', relatedEntityType);
    }
    if (relatedEntityId) {
      formData.append('relatedEntityId', relatedEntityId.toString());
    }

    try {
      await uploadDocument(formData).unwrap();
      toast.success('Document uploaded successfully');
      handleClose();
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const handleClose = () => {
    setFile(null);
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography>
              {file ? file.name : 'Click or drag file to upload'}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || !category}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
} 