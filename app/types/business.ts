export enum BusinessPhase {
    // 获客阶段
    ADVERTISING = 'ADVERTISING',
    OFFLINE_CONTACT = 'OFFLINE_CONTACT',
    REFERRAL = 'REFERRAL',
    PACKAGE_DESIGN = 'PACKAGE_DESIGN',
    CONTRACT_SIGNING = 'CONTRACT_SIGNING',

    // 服务阶段
    IVF = 'IVF',
    EMBRYO_TRANSFER = 'EMBRYO_TRANSFER',
    PREGNANCY_CARE = 'PREGNANCY_CARE',
    DELIVERY = 'DELIVERY',
    PATERNITY_TEST = 'PATERNITY_TEST',
    OVERSEAS_CARE = 'OVERSEAS_CARE',
    IMMIGRATION_SETTLEMENT = 'IMMIGRATION_SETTLEMENT'
}

export enum BusinessStatus {
    NORMAL = 'NORMAL',
    ABNORMAL = 'ABNORMAL',
    TERMINATED = 'TERMINATED',
    COMPLETED = 'COMPLETED'
}

export interface BusinessDTO {
    id?: number;
    customerId: number;
    customerName?: string;
    currentPhase: BusinessPhase;
    status: BusinessStatus;
    businessType: string;
    location: string;
    totalAmount: number;
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    createdAt?: string;
    updatedAt?: string;
    remark?: string;
}

export interface BusinessStatusRecordDTO {
    id?: number;
    businessId: number;
    previousPhase: BusinessPhase;
    currentPhase: BusinessPhase;
    operator: string;
    remark?: string;
    isAbnormal: boolean;
    abnormalReason?: string;
    solution?: string;
    createdAt?: string;
}

export interface MarketingRecordDTO {
    id?: number;
    businessId: number;
    channel: string;
    cost: number;
    conversionSource: string;
    referralCustomerId?: number;
    referralCustomerName?: string;
    marketingContent: string;
    effectiveDate: string;
    createdAt?: string;
}

export interface MedicalRecordDTO {
    id?: number;
    businessId: number;
    recordType: string;
    hospitalName: string;
    doctorName: string;
    checkDate: string;
    reportContent: string;
    reportFiles: string[];
    ocrResults: string;
    abnormalFlags: string[];
    followUpActions?: string;
    createdAt?: string;
} 