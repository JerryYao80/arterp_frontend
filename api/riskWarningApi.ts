import axios from 'axios';
import { RiskWarning } from '../types/risk';

const BASE_URL = '/api/risk-warnings';

export const riskWarningApi = {
    create: async (riskWarning: Omit<RiskWarning, 'id'>) => {
        const response = await axios.post(BASE_URL, riskWarning);
        return response.data;
    },

    update: async (id: number, riskWarning: Partial<RiskWarning>) => {
        const response = await axios.put(`${BASE_URL}/${id}`, riskWarning);
        return response.data;
    },

    delete: async (id: number) => {
        await axios.delete(`${BASE_URL}/${id}`);
    },

    getById: async (id: number) => {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    getAll: async () => {
        const response = await axios.get(BASE_URL);
        return response.data;
    },

    getByType: async (type: string, status: string = 'ACTIVE') => {
        const response = await axios.get(`${BASE_URL}/by-type`, {
            params: { type, status }
        });
        return response.data;
    },

    getByLevel: async (level: string, status: string = 'ACTIVE') => {
        const response = await axios.get(`${BASE_URL}/by-level`, {
            params: { level, status }
        });
        return response.data;
    },

    getBySource: async (sourceId: number, type: string) => {
        const response = await axios.get(`${BASE_URL}/by-source`, {
            params: { sourceId, type }
        });
        return response.data;
    },

    getByStatus: async (status: string) => {
        const response = await axios.get(`${BASE_URL}/by-status`, {
            params: { status }
        });
        return response.data;
    },

    resolve: async (id: number, resolvedBy: string, resolutionNotes: string) => {
        const response = await axios.post(`${BASE_URL}/${id}/resolve`, null, {
            params: { resolvedBy, resolutionNotes }
        });
        return response.data;
    }
}; 