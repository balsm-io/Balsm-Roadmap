import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  /** Options array */
  options: SelectOption[];
  /** Currently selected value (controlled) */
  value?: string | null;
  /** Called with the new value when user selects */
  onChange?: (value: string) => void;
  /** Placeholder shown when no value selected */
  placeholder?: string;
  /** Field label */
  label?: string;
  /** Helper text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Disables the trigger */
  disabled?: boolean;
  /** Show a search input inside the dropdown */
  searchable?: boolean;
  /** Height scale */
  size?: SelectSize;
  /** Stretch to 100% width */
  fullWidth?: boolean;
  id?: string;
  /** Text direction */
  dir?: 'ltr' | 'rtl';
  className?: string;
  style?: React.CSSProperties;
}

export declare function Select(props: SelectProps): React.ReactElement;
