import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  rowCount: number;
}

export default function DataTable({
  rows,
  columns,
  loading = false,
  paginationModel,
  onPaginationModelChange,
  rowCount,
}: DataTableProps) {
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 25, 50]}
        paginationMode="server"
        rowCount={rowCount}
        disableRowSelectionOnClick
        disableColumnFilter
      />
    </Box>
  );
} 