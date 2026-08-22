import * as React from 'react';

export type PickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps {
  /** Selected date as ISO 'YYYY-MM-DD' (controlled) */
  value?: string | null;
  /** Called with the new ISO 'YYYY-MM-DD' string, or null when cleared */
  onChange?: (value: string | null) => void;
  /** Field label */
  label?: string;
  /** Helper text */
  hint?: string;
  /** Error message — replaces hint and reddens the field */
  error?: string;
  /** Placeholder shown when no date is selected */
  placeholder?: string;
  /** Disables the trigger */
  disabled?: boolean;
  /** Show the inline clear (×) affordance and footer "Clear" action */
  clearable?: boolean;
  /** Earliest selectable date, ISO 'YYYY-MM-DD' */
  min?: string;
  /** Latest selectable date, ISO 'YYYY-MM-DD' */
  max?: string;
  /** Height scale */
  size?: PickerSize;
  /** Stretch to 100% width */
  fullWidth?: boolean;
  /** Start weeks on Monday instead of Sunday */
  weekStartsMonday?: boolean;
  id?: string;
  /** Text direction — 'rtl' switches month/weekday names to Arabic */
  dir?: 'ltr' | 'rtl';
  className?: string;
  style?: React.CSSProperties;
}

/** Calendar date picker. Egypt-localized DD/MM/YYYY display; ISO value in/out. */
export declare function DatePicker(props: DatePickerProps): React.ReactElement;
