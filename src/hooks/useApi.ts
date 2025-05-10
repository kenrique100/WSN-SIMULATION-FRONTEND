import { useState, useEffect, useCallback } from 'react';

type ApiFunction<T> = (...args: any[]) => Promise<T>;

interface UseApiResult<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    execute: (...args: any[]) => Promise<void>;
}

export function useApi<T>(apiFunction: ApiFunction<T>, immediate = false): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async (...args: any[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiFunction(...args);
            setData(response);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [apiFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { data, error, isLoading, execute };
}