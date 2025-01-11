import { ReactNode } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbar,
  GridPaginationModel,
  GridToolbarProps,
} from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  onRowClick?: (params: GridRowParams) => void;
  toolbar?: React.ComponentType<GridToolbarProps>;
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  rowCount?: number;
}

export default function DataTable({
  rows,
  columns,
  loading = false,
  onRowClick,
  toolbar,
  checkboxSelection = false,
  disableRowSelectionOnClick = true,
  paginationModel,
  onPaginationModelChange,
  rowCount,
}: DataTableProps) {
  return (
    <Paper elevation={2}>
      <Box sx={{ width: '100%', height: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          onRowClick={onRowClick}
          slots={{
            toolbar: toolbar || GridToolbar,
          }}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          rowCount={rowCount}
          paginationMode="server"
          pageSizeOptions={[10, 25, 50]}
          density="comfortable"
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Box>
    </Paper>
  );
} 