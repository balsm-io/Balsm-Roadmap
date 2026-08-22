import * as React from 'react';

export interface TopLoadingBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Controlled 0–100. Leave null and pass `loading` to auto-trickle. */
  value?: number | null;
  /** Auto-trickle mode: creeps to ~90%, completes + fades on false. */
  loading?: boolean;
  variant?: 'primary' | 'accent' | 'success' | 'brand';
  /** Bar thickness in px. Default 3. */
  height?: number;
  /** Pin to a positioned parent (absolute) instead of the viewport (fixed). */
  contained?: boolean;
  /** Continuous slide instead of determinate fill. */
  indeterminate?: boolean;
}

export declare function TopLoadingBar(props: TopLoadingBarProps): React.ReactElement | null;
