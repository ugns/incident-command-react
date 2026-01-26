import { useCallback, useEffect, useState } from 'react';
import type { CrudService } from '../services/types';

export function useCrudResource<T>(
  service: CrudService<T>,
  token: string | null,
  onAuthError?: () => void
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const data = await service.list(token, onAuthError);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [service, token, onAuthError]);

  const add = useCallback(async (data: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const created = await service.create(data, token, onAuthError);
      await refresh();
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service, token, onAuthError, refresh]);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const updated = await service.update(id, data, token, onAuthError);
      await refresh();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update');
      return null;
    } finally {
      setLoading(false);
    }
  }, [service, token, onAuthError, refresh]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await service.delete(id, token, onAuthError);
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  }, [service, token, onAuthError, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    items,
    loading,
    error,
    refresh,
    add,
    update,
    remove,
  };
}
