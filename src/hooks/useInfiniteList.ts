import { useCallback, useEffect, useState } from 'react';
import type { Paginated } from '../api/types';

interface UseInfiniteListOptions<T> {
  fetchFirstPage: () => Promise<Paginated<T>>;
  fetchNextPage: (next: string) => Promise<Paginated<T>>;
}

interface UseInfiniteListResult<T> {
  results: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  hasError: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
}

// Generic pagination state for the 4 horizontally-scrolled lists (Places,
// Events, Rewards, Partners). `fetchFirstPage`/`fetchNextPage` must be
// stable across renders (wrap with useCallback at the call site).
export function useInfiniteList<T>({
  fetchFirstPage,
  fetchNextPage,
}: UseInfiniteListOptions<T>): UseInfiniteListResult<T> {
  const [results, setResults] = useState<T[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const page = await fetchFirstPage();
      setResults(page.results);
      setNext(page.next);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFirstPage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const loadMore = useCallback(() => {
    if (!next || isLoadingMore) return;
    setIsLoadingMore(true);
    fetchNextPage(next)
      .then((page) => {
        setResults((prev) => [...prev, ...page.results]);
        setNext(page.next);
      })
      .catch(() => {
        // Pagination failures shouldn't wipe out the already-loaded list.
      })
      .finally(() => setIsLoadingMore(false));
  }, [next, isLoadingMore, fetchNextPage]);

  return { results, isLoading, isLoadingMore, hasMore: next !== null, hasError, loadMore, refresh };
}
