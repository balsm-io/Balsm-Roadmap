import * as React from 'react';

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastOptions {
  /** Semantic color */
  variant?: ToastVariant;
  /** Bold first line */
  title?: string;
  /** Secondary description */
  message?: string;
  /** Inline action link */
  action?: { label: string; onClick: () => void };
  /** Auto-dismiss ms. 0 = persistent. Default 4500 */
  duration?: number;
  /** Show × button. Default true */
  closeable?: boolean;
}

export interface ToastProps extends ToastOptions {
  id: number;
  onClose?: () => void;
}

export interface ToastContainerProps {
  /** Where toasts stack on screen */
  position?: ToastPosition;
}

/** Add a toast imperatively (works outside React) */
export declare function addToast(opts: ToastOptions): number;
/** Remove a toast by its returned id */
export declare function removeToast(id: number): void;
/** Hook returning { addToast, removeToast } */
export declare function useToast(): {
  addToast:    (opts: ToastOptions) => number;
  removeToast: (id: number) => void;
};
/** Single toast item */
export declare function Toast(props: ToastProps): React.ReactElement;
/** Fixed portal that renders the active queue */
export declare function ToastContainer(props?: ToastContainerProps): React.ReactElement | null;
