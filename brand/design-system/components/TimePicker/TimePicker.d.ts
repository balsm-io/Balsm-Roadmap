import * as React from 'react';

export type PickerSize = 'sm' | 'md' | 'lg';

export interface TimePickerProps {
  /** Selected time as 24-hour 'HH:MM' (controlled) — always 24h regardless of display */
  value?: string | null;
  /** Called with the new 24-hour 'HH:MM' string, or null when cleared */
  onChange?: (value: string | null) => void;
  /** Field label */
  label?: string;
  /** Helper text */
  hint?: string;
  /** Error message — replaces hint and reddens the field */
  error?: string;
  /** Placeholder shown when no time is selected */
  placeholder?: string;
  /** Disables the trigger */
  disabled?: boolean;
  /** Show the inline clear (×) affordance and footer "Clear" action */
  clearable?: boolean;
  /** Minute granularity in the minutes column (default 5) */
  minuteStep?: number;
  /** Display 12-hour time with AM/PM (ص/م in RTL). Value stays 24h. */
  use12Hour?: boolean;
  /** Earliest selectable time, 24-hour 'HH:MM' */
  min?: string;
  /** Latest selectable time, 24-hour 'HH:MM' */
  max?: string;
  /** Height scale */
  size?: PickerSize;
  /** Stretch to 100% width */
  fullWidth?: boolean;
  id?: string;
  /** Text direction — 'rtl' switches AM/PM to ص/م */
  dir?: 'ltr' | 'rtl';
  className?: string;
  style?: React.CSSProperties;
}

/** Scrollable hour/minute (and AM/PM) time picker. 24-hour value in/out. */
export declare function TimePicker(props: TimePickerProps): React.ReactElement;
