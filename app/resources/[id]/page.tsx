'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import { resourceApi } from '../../api/resourceApi';
import { businessApi } from '../../api/businessApi';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import MainLayout from '../../components/layout/MainLayout';

interface ResourceDetailsProps {
  params: {
    id: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resource-tabpanel-${index}`}
      aria-labelledby={`resource-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ResourceDetailsPage({ params }: ResourceDetailsProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();
  const id = parseInt(params.id);
  const [tabValue, setTabValue] = useState(0);

  const { data: resourceData, isLoading } = resourceApi.useGetResourceQuery(id);
  const { data: processesData } = businessApi.useSearchProcessesQuery({
    resourceId: id,
    page: 0,
    size: 10,
  });
  const [deleteResource] = resourceApi.useDeleteResourceMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const resource = resourceData?.data;

  if (!resource) {
    return <div>Resource not found</div>;
  }

  const handleEdit = () => {
    router.push(`/resources/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Resource',
      message: 'Are you sure you want to delete this resource? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteResource(id).unwrap();
        showSuccess('Resource deleted successfully');
        router.push('/resources');
      } catch (error) {
        showError('Failed to delete resource');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'In Use':
        return 'warning';
      case 'Maintenance':
        return 'info';
      case 'Unavailable':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <PageHeader
          title="Resource Details"
          action={{
            label: 'Edit Resource',
            icon: <EditIcon />,
            onClick: handleEdit,
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Resource Information
                </Typography>
                <Tooltip title="Delete Resource">
                  <IconButton color="error" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{resource.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{resource.type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={resource.status}
                    color={getStatusColor(resource.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{resource.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Maintenance Date
                  </Typography>
                  <Typography variant="body1">
                    {resource.lastMaintenanceDate
                      ? format(new Date(resource.lastMaintenanceDate), 'PPP')
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Next Maintenance Date
                  </Typography>
                  <Typography variant="body1">
                    {resource.nextMaintenanceDate
                      ? format(new Date(resource.nextMaintenanceDate), 'PPP')
                      : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Description" />
                  <Tab label="Maintenance History" />
                  <Tab label="Usage History" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1">{resource.description}</Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <List>
                  {resource.maintenanceHistory?.map((record, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={record.type}
                        secondary={
                          <>
                            <Typography variant="caption" display="block">
                              {format(new Date(record.date), 'PPP')}
                            </Typography>
                            <Typography variant="body2">{record.notes}</Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <List>
                  {processesData?.data.content.map((process) => (
                    <ListItem key={process.id}>
                      <ListItemText
                        primary={process.processType}
                        secondary={
                          <>
                            <Typography variant="caption" display="block">
                              {format(new Date(process.startDate), 'PPP')}
                            </Typography>
                            <Chip
                              label={process.status}
                              size="small"
                              color={
                                process.status === 'Completed'
                                  ? 'success'
                                  : process.status === 'In Progress'
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          </>
                        }
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => router.push(`/business/${process.id}`)}
                      >
                        View Process
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {resource.documentUrls?.map((url, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Document ${index + 1}`}
                      secondary={url}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
} 