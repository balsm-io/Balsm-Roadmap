import * as React from 'react';

export type SkeletonVariant = 'rect' | 'text' | 'title' | 'circle' | 'pill' | 'card';

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Shape preset. Default `rect`. */
  variant?: SkeletonVariant;
  /** CSS width (number = px). */
  width?: number | string;
  /** CSS height (number = px). For `circle`, defaults to width. */
  height?: number | string;
  /** With variant="text": number of stacked lines. */
  lines?: number;
  /** Width of the final text line when lines > 1. Default `62%`. */
  lastWidth?: number | string;
  /** Override border-radius (number = px). */
  radius?: number | string;
}

export declare function Skeleton(props: SkeletonProps): React.ReactElement;
