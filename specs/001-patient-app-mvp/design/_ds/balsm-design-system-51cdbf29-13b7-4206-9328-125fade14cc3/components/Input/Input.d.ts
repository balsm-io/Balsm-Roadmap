import * as React from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  /** Field label rendered above the input */
  label?: string;
  /** Helper text shown below */
  hint?: string;
  /** Error message — replaces hint, adds error styling */
  error?: string;
  /** Leading icon (ReactNode) */
  leadingIcon?: React.ReactNode;
  /** Trailing icon (ReactNode) */
  trailingIcon?: React.ReactNode;
  /** Height scale */
  size?: InputSize;
  /** Stretch to 100% width */
  fullWidth?: boolean;
  /** Render a <textarea> instead of <input> */
  multiline?: boolean;
  /** Rows when multiline (default 4) */
  rows?: number;
  /** RTL text direction */
  dir?: 'ltr' | 'rtl' | 'auto';
  /** Style applied to the outer field wrapper */
  style?: React.CSSProperties;
  /** Style applied directly to the input element */
  inputStyle?: React.CSSProperties;
}

export declare function Input(props: InputProps): React.ReactElement;
