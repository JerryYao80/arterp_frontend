import { useState } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid';

interface UseTableOptions {
  defaultPageSize?: number;
  defaultPage?: number;
}

export function useTable({ defaultPageSize = 10, defaultPage = 0 }: UseTableOptions = {}) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: defaultPageSize,
    page: defaultPage,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
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