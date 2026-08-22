import * as React from 'react';

export type BadgeVariant =
  | 'success' | 'warning' | 'danger' | 'info'
  | 'controlled' | 'expiring' | 'neutral'
  | 'brand' | 'outline' | 'emerald';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic color + icon preset */
  variant?: BadgeVariant;
  /** sm = 11px compact, md = 12px default */
  size?: BadgeSize;
  /** Show a leading status dot */
  dot?: boolean;
  /** Leading icon (ReactNode). When set, dot is ignored. */
  icon?: React.ReactNode;
  /** When provided, renders a × dismiss button */
  onRemove?: () => void;
  children: React.ReactNode;
}

export declare function Badge(props: BadgeProps): React.ReactElement;
