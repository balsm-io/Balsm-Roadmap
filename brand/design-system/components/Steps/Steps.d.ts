import * as React from 'react';

export type StepStatus = 'done' | 'active' | 'upcoming';

export interface StepItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Override the auto-derived status. */
  status?: StepStatus;
}

export interface StepsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  steps: StepItem[];
  /** Index of the active step; earlier steps render as done. */
  current?: number;
  /** numbered = index/check marker · dot = slim dot marker. */
  variant?: 'numbered' | 'dot';
  color?: 'primary' | 'success' | 'violet';
  orientation?: 'horizontal' | 'vertical';
  /** Horizontal steppers collapse to vertical in a narrow container. Default true. */
  responsive?: boolean;
}

export declare function Steps(props: StepsProps): React.ReactElement;
