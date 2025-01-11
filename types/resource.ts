export interface MaintenanceRecord {
  id: number;
  type: string;
  date: string;
  notes: string;
  cost: number;
  performedBy: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
  description: string;
  specifications: string;
  notes: string;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  maintenanceHistory: MaintenanceRecord[];
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceSearchParams {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface ResourceResponse {
  data: Resource;
  message: string;
}

export interface ResourceListResponse {
  data: {
    content: Resource[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
} 