import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual style */
  variant?: ButtonVariant;
  /** Height scale */
  size?: ButtonSize;
  /** Shows spinner, blocks interaction */
  loading?: boolean;
  /** Leading icon — any ReactNode */
  icon?: React.ReactNode;
  /** Trailing icon */
  iconTrailing?: React.ReactNode;
  /** Stretch to 100% container width */
  fullWidth?: boolean;
  /** Button label */
  children: React.ReactNode;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
}

export declare function Button(props: ButtonProps): React.ReactElement;
