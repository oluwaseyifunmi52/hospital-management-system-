import { useRef, useState, useCallback, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled = false, autoFocus = true }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
        setFocusedIndex(index);
      }
    },
    [length]
  );

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (disabled) return;
      if (!/^\d*$/.test(digit)) return;

      const newValue = value.split('');
      newValue[index] = digit.slice(-1);
      const result = newValue.join('').slice(0, length);
      onChange(result);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [value, onChange, length, disabled, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        const newValue = value.split('');
        if (newValue[index]) {
          newValue[index] = '';
          onChange(newValue.join(''));
        } else if (index > 0) {
          newValue[index - 1] = '';
          onChange(newValue.join(''));
          focusInput(index - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusInput(index + 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (value.length === length) {
          // Trigger form submit via parent
          (e.target as HTMLInputElement).closest('form')?.requestSubmit();
        }
      }
    },
    [value, onChange, length, disabled, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pastedData) {
        onChange(pastedData);
        focusInput(Math.min(pastedData.length, length - 1));
      }
    },
    [onChange, length, disabled, focusInput]
  );

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    // Select the content when focused
    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(i)}
          disabled={disabled}
          className={`h-14 w-12 text-center text-xl font-semibold rounded-lg border-2 transition-all duration-200 focus:outline-none ${
            focusedIndex === i
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : value[i]
              ? 'border-primary-300 bg-primary-50'
              : 'border-secondary-300 hover:border-secondary-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-secondary-50' : 'bg-white'}`}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
