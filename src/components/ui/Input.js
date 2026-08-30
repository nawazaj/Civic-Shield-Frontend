import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { cn } from '../../lib/utils';

export function Input({ className, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor="#767676"
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      className={cn(
        'rounded-lg border bg-panel px-3.5 py-2.5 text-[13px] text-hi',
        focused ? 'border-green' : 'border-border',
        className
      )}
      {...props}
    />
  );
}
