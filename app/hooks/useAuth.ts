import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!requireAuth && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, requireAuth, router]);

  return { isAuthenticated };
} 