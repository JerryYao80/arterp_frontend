'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import DocumentList from './components/DocumentList';
import DocumentUpload from './components/DocumentUpload';
import DocumentPreview from './components/DocumentPreview';
import { documentApi } from '@/api/documentApi';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { user } = useAuth();

  const { data: documents, isLoading } = documentApi.useSearchDocumentsQuery({});
  const { data: stats } = documentApi.useGetDocumentStatsQuery();

  const handleView = (document: any) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Document Management"
        subtitle="Manage and organize all documents"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadOpen(true)}
          >
            Upload Document
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Documents"
            value={documents?.data.totalElements || 0}
            icon={<AddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Active Documents"
            value={
              stats?.data.statusDistribution?.Active ||
              0
            }
            icon={<AddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Categories"
            value={
              Object.keys(stats?.data.categoryDistribution || {})
                .length || 0
            }
            icon={<AddIcon />}
          />
        </Grid>

        {/* Document List */}
        <Grid item xs={12}>
          <Paper>
            <Box p={3}>
              <DocumentList
                documents={documents?.data.content || []}
                onView={handleView}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Upload Dialog */}
      <DocumentUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        uploadedBy={user?.username || ''}
      />

      {/* Preview Dialog */}
      {selectedDocument && (
        <DocumentPreview
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          document={selectedDocument}
        />
      )}
    </MainLayout>
  );
} 