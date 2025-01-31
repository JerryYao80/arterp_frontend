import axios from 'axios';
import { BusinessDTO, BusinessStatusRecordDTO, MarketingRecordDTO, MedicalRecordDTO } from '../types/business';
import { ApiResponse, PageResponse, BusinessProcess } from '../types/api';
import { BaseQueryFn } from '@reduxjs/toolkit/query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const businessApiBase = {
    // 业务基本操作
    createBusiness: async (business: BusinessDTO) => {
        const response = await axios.post(`${API_URL}/api/businesses`, business);
        return response.data;
    },

    updateBusiness: async (id: number, business: BusinessDTO) => {
        const response = await axios.put(`${API_URL}/api/businesses/${id}`, business);
        return response.data;
    },

    getBusiness: async (id: number) => {
        const response = await axios.get(`${API_URL}/api/businesses/${id}`);
        return response.data;
    },

    getBusinessesByCustomer: async (customerId: number) => {
        const response = await axios.get(`${API_URL}/api/businesses/customer/${customerId}`);
        return response.data;
    },

    getBusinessesByPhase: async (phase: string) => {
        const response = await axios.get(`${API_URL}/api/businesses/phase/${phase}`);
        return response.data;
    },

    getBusinessesByStatus: async (status: string) => {
        const response = await axios.get(`${API_URL}/api/businesses/status/${status}`);
        return response.data;
    },

    deleteBusiness: async (id: number) => {
        await axios.delete(`${API_URL}/api/businesses/${id}`);
    },

    // 业务状态记录操作
    createStatusRecord: async (record: BusinessStatusRecordDTO) => {
        const response = await axios.post(`${API_URL}/api/business-status-records`, record);
        return response.data;
    },

    getBusinessStatusRecords: async (businessId: number) => {
        const response = await axios.get(`${API_URL}/api/business-status-records/business/${businessId}`);
        return response.data;
    },

    getAbnormalStatusRecords: async (businessId: number) => {
        const response = await axios.get(`${API_URL}/api/business-status-records/business/${businessId}/abnormal`);
        return response.data;
    },

    updateStatusRecord: async (id: number, record: BusinessStatusRecordDTO) => {
        const response = await axios.put(`${API_URL}/api/business-status-records/${id}`, record);
        return response.data;
    },

    deleteStatusRecord: async (id: number) => {
        await axios.delete(`${API_URL}/api/business-status-records/${id}`);
    },

    // 营销记录操作
    createMarketingRecord: async (record: MarketingRecordDTO) => {
        const response = await axios.post(`${API_URL}/api/marketing-records`, record);
        return response.data;
    },

    getMarketingRecords: async (businessId: number) => {
        const response = await axios.get(`${API_URL}/api/marketing-records/business/${businessId}`);
        return response.data;
    },

    updateMarketingRecord: async (id: number, record: MarketingRecordDTO) => {
        const response = await axios.put(`${API_URL}/api/marketing-records/${id}`, record);
        return response.data;
    },

    deleteMarketingRecord: async (id: number) => {
        await axios.delete(`${API_URL}/api/marketing-records/${id}`);
    },

    // 医疗记录操作
    createMedicalRecord: async (record: MedicalRecordDTO) => {
        const response = await axios.post(`${API_URL}/api/medical-records`, record);
        return response.data;
    },

    getMedicalRecords: async (businessId: number) => {
        const response = await axios.get(`${API_URL}/api/medical-records/business/${businessId}`);
        return response.data;
    },

    getMedicalRecordsByType: async (businessId: number, recordType: string) => {
        const response = await axios.get(`${API_URL}/api/medical-records/business/${businessId}/type/${recordType}`);
        return response.data;
    },

    getAbnormalMedicalRecords: async (businessId: number) => {
        const response = await axios.get(`${API_URL}/api/medical-records/business/${businessId}/abnormal`);
        return response.data;
    },

    updateMedicalRecord: async (id: number, record: MedicalRecordDTO) => {
        const response = await axios.put(`${API_URL}/api/medical-records/${id}`, record);
        return response.data;
    },

    deleteMedicalRecord: async (id: number) => {
        await axios.delete(`${API_URL}/api/medical-records/${id}`);
    },

    // 统计数据
    getPhaseStatistics: async () => {
        const response = await axios.get(`${API_URL}/api/businesses/statistics/phase`);
        return response.data;
    },

    getLocationStatistics: async () => {
        const response = await axios.get(`${API_URL}/api/businesses/statistics/location`);
        return response.data;
    },

    getTypeStatistics: async () => {
        const response = await axios.get(`${API_URL}/api/businesses/statistics/type`);
        return response.data;
    },

    getChannelStatistics: async () => {
        const response = await axios.get(`${API_URL}/api/marketing-records/statistics/channel`);
        return response.data;
    },

    getConversionSourceStatistics: async () => {
        const response = await axios.get(`${API_URL}/api/marketing-records/statistics/conversion-source`);
        return response.data;
    }
};

export const businessApi = {
    ...businessApiBase,
    // RTK Query endpoints
    endpoints: (builder: any) => ({
        searchProcesses: builder.query<ApiResponse<PageResponse<BusinessProcess>>, { search?: string; page?: number; size?: number }>({
            query: ({ search = '', page = 0, size = 10 }) =>
                `/business/search?search=${search}&page=${page}&size=${size}`,
            providesTags: ['Business'],
        }),
        // ... 其他 RTK Query endpoints
    }),
}; 