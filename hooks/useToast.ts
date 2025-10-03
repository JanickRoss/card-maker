"use client";

import { useState, useCallback } from "react";
import type { ToastProps } from "@/components/ui/Toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((toast: Omit<ToastProps, "onClose">) => {
    const id = Date.now();
    const newToast: ToastProps = {
      ...toast,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t !== newToast));
      },
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast));
    }, toast.duration || 3000);
  }, []);

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "info", duration });
    },
    [showToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "success", duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "warning", duration });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "error", duration });
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    info,
    success,
    warning,
    error,
  };
}
