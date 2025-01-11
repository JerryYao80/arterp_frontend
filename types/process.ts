export interface Task {
  id: number;
  name: string;
  taskType: string;
  status: string;
  sequence: number;
  startDate: string;
  expectedEndDate: string | null;
  budget: number;
  spent: number;
  assignedResourceIds: number[];
  description: string;
  notes: string;
  result: string;
  nextAction: string;
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: number;
  name: string;
  status: string;
  sequence: number;
  startDate: string;
  expectedEndDate: string | null;
  budget: number;
  spent: number;
  assignedResourceIds: number[];
  notes: string;
  tasks: Task[];
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Process {
  id: number;
  customerId: number;
  processType: string;
  status: string;
  startDate: string;
  expectedEndDate: string | null;
  budget: number;
  spent: number;
  description: string;
  notes: string;
  stages: Stage[];
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessSearchParams {
  search?: string;
  customerId?: number;
  processType?: string;
  status?: string;
  resourceId?: number;
  page?: number;
  size?: number;
}

export interface ProcessResponse {
  data: Process;
  message: string;
}

export interface ProcessListResponse {
  data: {
    content: Process[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
}

export interface CreateTaskDto {
  name: string;
  taskType: string;
  status: string;
  sequence: number;
  startDate: string;
  expectedEndDate?: string;
  budget: number;
  assignedResourceIds?: number[];
  description?: string;
  notes?: string;
  result?: string;
  nextAction?: string;
  documentUrls?: string[];
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface CreateStageDto {
  name: string;
  status: string;
  sequence: number;
  startDate: string;
  expectedEndDate?: string;
  budget: number;
  assignedResourceIds?: number[];
  notes?: string;
  documentUrls?: string[];
}

export interface UpdateStageDto extends Partial<CreateStageDto> {}

export interface CreateProcessDto {
  customerId: number;
  processType: string;
  status: string;
  startDate: string;
  expectedEndDate?: string;
  budget: number;
  description?: string;
  notes?: string;
  documentUrls?: string[];
}

export interface UpdateProcessDto extends Partial<CreateProcessDto> {} 