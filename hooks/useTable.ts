import { useState } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid';

export function useTable() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  return {
    paginationModel,
    searchQuery,
    loading,
    totalRows,
    setLoading,
    setTotalRows,
    handlePaginationModelChange,
    handleSearchChange,
  };
} 