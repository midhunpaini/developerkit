import { useEffect, useMemo, useRef, useState } from 'react';

import {
  buildWebhookStreamUrl,
  getApiErrorMessage,
  listWebhookRequests
} from '@/features/webhooks/api/client';
import type { WebhookRequest } from '@/features/webhooks/types';

export interface UseWebhookRequestsResult {
  requests: WebhookRequest[];
  selectedRequestId: string | null;
  selectedRequest: WebhookRequest | null;
  isStreaming: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  selectRequest: (id: string) => void;
  resetStream: () => void;
}

function sortRequestsNewestFirst(a: WebhookRequest, b: WebhookRequest) {
  if (a.receivedAt === b.receivedAt) {
    return b.id.localeCompare(a.id);
  }

  return a.receivedAt < b.receivedAt ? 1 : -1;
}

function upsertRequest(prev: WebhookRequest[], incoming: WebhookRequest) {
  const next = [incoming, ...prev.filter((item) => item.id !== incoming.id)];
  next.sort(sortRequestsNewestFirst);
  return next;
}

export function useWebhookRequests(endpointId: string): UseWebhookRequestsResult {
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState(0);
  const userPinnedSelectionRef = useRef(false);

  useEffect(() => {
    userPinnedSelectionRef.current = false;
    setRequests([]);
    setSelectedRequestId(null);
    setIsStreaming(false);
    setIsLoading(true);
    setErrorMessage(null);

    const abortController = new AbortController();
    let eventSource: EventSource | null = null;
    let disposed = false;

    async function initialize() {
      try {
        const initial = await listWebhookRequests(endpointId, {
          limit: 50,
          signal: abortController.signal
        });

        if (disposed) {
          return;
        }

        const initialItems = [...initial.items].sort(sortRequestsNewestFirst);
        setRequests(initialItems);
        setSelectedRequestId((current) => current ?? initialItems[0]?.id ?? null);
        setIsLoading(false);

        eventSource = new EventSource(buildWebhookStreamUrl(endpointId));

        eventSource.addEventListener('stream.ready', () => {
          if (!disposed) {
            setIsStreaming(true);
            setErrorMessage(null);
          }
        });

        eventSource.addEventListener('request.created', (event) => {
          if (disposed) {
            return;
          }

          try {
            const parsed = JSON.parse((event as MessageEvent<string>).data) as {
              request?: WebhookRequest;
            };

            if (!parsed.request) {
              return;
            }

            setRequests((prev) => upsertRequest(prev, parsed.request!));
            setSelectedRequestId((current) => {
              if (userPinnedSelectionRef.current && current) {
                return current;
              }

              return parsed.request!.id;
            });
          } catch {
            // Ignore malformed events and keep stream alive.
          }
        });

        eventSource.onerror = () => {
          if (!disposed) {
            setIsStreaming(false);
          }
        };
      } catch (error) {
        if (disposed || abortController.signal.aborted) {
          return;
        }

        setIsLoading(false);
        setIsStreaming(false);
        setErrorMessage(getApiErrorMessage(error));
      }
    }

    void initialize();

    return () => {
      disposed = true;
      abortController.abort();
      eventSource?.close();
      setIsStreaming(false);
    };
  }, [endpointId, streamKey]);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );

  function selectRequest(id: string) {
    userPinnedSelectionRef.current = true;
    setSelectedRequestId(id);
  }

  function resetStream() {
    userPinnedSelectionRef.current = false;
    setStreamKey((current) => current + 1);
  }

  return {
    requests,
    selectedRequestId,
    selectedRequest,
    isStreaming,
    isLoading,
    errorMessage,
    selectRequest,
    resetStream
  };
}
