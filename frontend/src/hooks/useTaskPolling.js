import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

export const useTaskPolling = () => {
  const [isPolling, setIsPolling] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const startPolling = useCallback((taskId, onSuccessCallback) => {
    setIsPolling(true);
    setResult(null);

    const poll = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_URL}/api/task-status/${taskId}/`);
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const data = await response.json();

        if (data.status === 'SUCCESS') {
          setIsPolling(false);
          setResult(data.result);
          if (onSuccessCallback) onSuccessCallback(data.result);
          toast.success('Task completed successfully!');
        } else if (data.status === 'FAILURE' || data.status === 'REVOKED') {
          setIsPolling(false);
          toast.error('Task failed during processing.');
        } else {
          // Continue polling if PENDING or RUNNING
          timerRef.current = setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error(error);
        setIsPolling(false);
        toast.error('Lost connection during polling.');
      }
    };

    poll();
  }, []);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsPolling(false);
  }, []);

  return { isPolling, result, startPolling, stopPolling };
};
