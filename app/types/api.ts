export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code: number;
}

export interface BusinessProcess {
    id?: number;
    customerId: number;
    processType: string;
    status: string;
    startDate: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    totalBudget: number;
    currentSpent: number;
    assignedResourceIds: number[];
    stages: ProcessStage[];
    notes?: string;
    riskLevel: string;
    documentUrls: string[];
}

export interface ProcessStage {
    id?: number;
    name: string;
    status: string;
    sequence: number;
    startDate: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    budget: number;
    spent: number;
    assignedResourceIds: number[];
    tasks: StageTask[];
    notes?: string;
    documentUrls: string[];
}

export interface StageTask {
    id?: number;
    name: string;
    status: string;
    sequence: number;
    startDate: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    budget: number;
    spent: number;
    assignedResourceIds: number[];
    description?: string;
    notes?: string;
    documentUrls: string[];
    taskType: string;
    result?: string;
    nextAction?: string;
}

export interface BusinessStats {
    activeProcesses: number;
    processGrowth: number;
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
    riskDistribution: Record<string, number>;
} 