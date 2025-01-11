import { useState, useEffect, useCallback } from 'react';
import { RiskWarning, RiskWarningType, RiskWarningStatus } from '../types/risk';
import { riskWarningApi } from '../api/riskWarningApi';
import { useToast } from '@/components/ui/use-toast';

export const useRiskWarnings = (initialType?: RiskWarningType, initialStatus: RiskWarningStatus = 'ACTIVE') => {
    const [warnings, setWarnings] = useState<RiskWarning[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchWarnings = useCallback(async (type?: RiskWarningType, status: RiskWarningStatus = 'ACTIVE') => {
        try {
            setLoading(true);
            setError(null);
            let data: RiskWarning[];
            
            if (type) {
                data = await riskWarningApi.getByType(type, status);
            } else {
                data = await riskWarningApi.getByStatus(status);
            }
            
            setWarnings(data);
        } catch (err) {
            setError('Failed to fetch risk warnings');
            toast({
                title: 'Error',
                description: 'Failed to fetch risk warnings',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const createWarning = async (warning: Omit<RiskWarning, 'id'>) => {
        try {
            setLoading(true);
            const newWarning = await riskWarningApi.create(warning);
            setWarnings(prev => [...prev, newWarning]);
            toast({
                title: 'Success',
                description: 'Risk warning created successfully'
            });
            return newWarning;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to create risk warning',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateWarning = async (id: number, warning: Partial<RiskWarning>) => {
        try {
            setLoading(true);
            const updatedWarning = await riskWarningApi.update(id, warning);
            setWarnings(prev => prev.map(w => w.id === id ? updatedWarning : w));
            toast({
                title: 'Success',
                description: 'Risk warning updated successfully'
            });
            return updatedWarning;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to update risk warning',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteWarning = async (id: number) => {
        try {
            setLoading(true);
            await riskWarningApi.delete(id);
            setWarnings(prev => prev.filter(w => w.id !== id));
            toast({
                title: 'Success',
                description: 'Risk warning deleted successfully'
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to delete risk warning',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resolveWarning = async (id: number, resolvedBy: string, resolutionNotes: string) => {
        try {
            setLoading(true);
            const resolvedWarning = await riskWarningApi.resolve(id, resolvedBy, resolutionNotes);
            setWarnings(prev => prev.map(w => w.id === id ? resolvedWarning : w));
            toast({
                title: 'Success',
                description: 'Risk warning resolved successfully'
            });
            return resolvedWarning;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to resolve risk warning',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarnings(initialType, initialStatus);
    }, [fetchWarnings, initialType, initialStatus]);

    return {
        warnings,
        loading,
        error,
        fetchWarnings,
        createWarning,
        updateWarning,
        deleteWarning,
        resolveWarning
    };
}; 