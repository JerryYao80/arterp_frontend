import { useState, useEffect, useCallback } from 'react';
import { Customer, CustomerType, CustomerStatus, CustomerOverview } from '../types/customer';
import { customerApi } from '../api/customerApi';
import { useToast } from '@/components/ui/use-toast';

export const useCustomers = (initialType?: CustomerType, initialStatus?: CustomerStatus) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [overview, setOverview] = useState<CustomerOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchCustomers = useCallback(async (type?: CustomerType, status?: CustomerStatus) => {
        try {
            setLoading(true);
            setError(null);
            let data: Customer[];
            
            if (type && status) {
                data = await customerApi.getByType(type);
                data = data.filter(c => c.status === status);
            } else if (type) {
                data = await customerApi.getByType(type);
            } else if (status) {
                data = await customerApi.getByStatus(status);
            } else {
                data = await customerApi.getAll();
            }
            
            setCustomers(data);
        } catch (err) {
            setError('Failed to fetch customers');
            toast({
                title: 'Error',
                description: 'Failed to fetch customers',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            const data = await customerApi.getOverview();
            setOverview(data);
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to fetch customer overview',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const createCustomer = async (customer: Omit<Customer, 'id'>) => {
        try {
            setLoading(true);
            const newCustomer = await customerApi.create(customer);
            setCustomers(prev => [...prev, newCustomer]);
            toast({
                title: 'Success',
                description: 'Customer created successfully'
            });
            return newCustomer;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to create customer',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCustomer = async (id: number, customer: Partial<Customer>) => {
        try {
            setLoading(true);
            const updatedCustomer = await customerApi.update(id, customer);
            setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
            toast({
                title: 'Success',
                description: 'Customer updated successfully'
            });
            return updatedCustomer;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to update customer',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCustomer = async (id: number) => {
        try {
            setLoading(true);
            await customerApi.delete(id);
            setCustomers(prev => prev.filter(c => c.id !== id));
            toast({
                title: 'Success',
                description: 'Customer deleted successfully'
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to delete customer',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCustomerRiskLevel = async (id: number, riskType: string, riskLevel: string) => {
        try {
            setLoading(true);
            const updatedCustomer = await customerApi.updateRiskLevel(id, riskType, riskLevel);
            setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
            toast({
                title: 'Success',
                description: 'Risk level updated successfully'
            });
            return updatedCustomer;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to update risk level',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCustomerScores = async (
        id: number,
        creditScore?: number,
        paymentCapability?: number,
        cooperation?: number
    ) => {
        try {
            setLoading(true);
            const updatedCustomer = await customerApi.updateScores(
                id,
                creditScore,
                paymentCapability,
                cooperation
            );
            setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
            toast({
                title: 'Success',
                description: 'Customer scores updated successfully'
            });
            return updatedCustomer;
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to update customer scores',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(initialType, initialStatus);
        fetchOverview();
    }, [fetchCustomers, fetchOverview, initialType, initialStatus]);

    return {
        customers,
        overview,
        loading,
        error,
        fetchCustomers,
        fetchOverview,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        updateCustomerRiskLevel,
        updateCustomerScores
    };
}; 