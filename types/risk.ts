export type RiskWarningType = 'CUSTOMER' | 'BUSINESS' | 'RESOURCE' | 'FINANCIAL';
export type RiskWarningLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskWarningStatus = 'ACTIVE' | 'RESOLVED' | 'IGNORED';

export interface RiskWarning {
    id: number;
    type: RiskWarningType;
    level: RiskWarningLevel;
    message: string;
    sourceId: number;
    createdAt: string;
    updatedAt: string;
    status: RiskWarningStatus;
    resolvedBy?: string;
    resolutionNotes?: string;
} 