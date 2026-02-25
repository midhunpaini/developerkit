import { useEffect, useMemo, useRef, useState } from 'react';

import { MOCK_EVENT_DELAYS_MS } from '@/features/webhooks/constants';
import { createMockWebhookEvents } from '@/features/webhooks/mock/mock-events';
import type { WebhookRequest } from '@/features/webhooks/types';

export interface UseMockWebhookStreamResult {
  requests: WebhookRequest[];
  selectedRequestId: string | null;
  selectedRequest: WebhookRequest | null;
  isStreaming: boolean;
  selectRequest: (id: string) => void;
  resetStream: () => void;
}

export function useMockWebhookStream(endpointId: string): UseMockWebhookStreamResult {
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamKey, setStreamKey] = useState(0);
  const userPinnedSelectionRef = useRef(false);

  useEffect(() => {
    userPinnedSelectionRef.current = false;
    setRequests([]);
    setSelectedRequestId(null);
    setIsStreaming(true);

    const events = createMockWebhookEvents(endpointId);
    const timerIds = events.map((event, index) =>
      window.setTimeout(() => {
        setRequests((prev) => [...prev, event]);
        setSelectedRequestId((current) => {
          if (userPinnedSelectionRef.current && current) {
            return current;
          }

          return event.id;
        });

        if (index === events.length - 1) {
          setIsStreaming(false);
        }
      }, MOCK_EVENT_DELAYS_MS[index])
    );

    return () => {
      timerIds.forEach((timerId) => window.clearTimeout(timerId));
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
    selectRequest,
    resetStream
  };
}
