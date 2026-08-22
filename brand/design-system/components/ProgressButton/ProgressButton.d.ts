import * as React from 'react';

export interface ProgressButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 0–100 determinate fill across the button surface. */
  progress?: number | null;
  /** Show an inline spinner + aria-busy. */
  loading?: boolean;
  /** Sweeping sheen for unknown-duration work. */
  indeterminate?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Append the rounded % after the label. */
  showPct?: boolean;
  children: React.ReactNode;
}

export declare function ProgressButton(props: ProgressButtonProps): React.ReactElement;
