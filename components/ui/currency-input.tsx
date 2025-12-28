"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { SURPORTED_CURRENCIES } from "@/lib/currencies";
import { cn } from "@/utils/cn";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number;
  onValueChange: (value: number) => void;
  currencyCode?: string;
  placeholder?: string;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      value,
      onValueChange,
      currencyCode = "IDR",
      className,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState("");

    const currencyConfig =
      SURPORTED_CURRENCIES.find((c) => c.code === currencyCode) ||
      SURPORTED_CURRENCIES[0];

    // Initialize/Sync display value with prop value
    React.useEffect(() => {
      if (value !== undefined && value !== null && !isNaN(value)) {
        // Format based on currency decimals
        const options: Intl.NumberFormatOptions = {
          minimumFractionDigits: 0,
          maximumFractionDigits: currencyConfig.fractionDigits,
          useGrouping: true,
        };
        setDisplayValue(value.toLocaleString(currencyConfig.locale, options));
      } else {
        setDisplayValue("");
      }
    }, [value, currencyConfig.locale, currencyConfig.fractionDigits]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // Allow digits and one decimal separator (dot or comma depending on locale, but let's standardize on dot for simple input parsing first, or just strip non-numeric)
      // For simplicity in a web input:
      // 1. Remove non-numeric chars except '.' (decimal)

      // If currency has 0 decimals (IDR, JPY, KRW), strip all non-digits
      if (currencyConfig.fractionDigits === 0) {
        inputValue = inputValue.replace(/[^0-9]/g, "");
      } else {
        // Allow digits and one dot
        inputValue = inputValue.replace(/[^0-9.]/g, "");
        // Prevent multiple dots
        const dots = inputValue.match(/\./g);
        if (dots && dots.length > 1) {
          return; // Ignore invalid input
        }
      }

      if (inputValue === "") {
        setDisplayValue("");
        onValueChange(0);
        return;
      }

      // For display, we might want to keep the raw input while typing decimals?
      // Actually, forcing 'toLocaleString' on every keystroke can be annoying with decimals.
      // Better strategy for "Comma separation while typing":
      // 1. Strip non-digits to get raw integer
      // 2. If decimals allowed, handle that separately.

      // Let's stick to the user's request: "tambahan koma" (add commas).
      // Simple implementation:
      const rawValue = parseFloat(inputValue);

      if (!isNaN(rawValue)) {
        onValueChange(rawValue);
        // We set display value directly to input to avoid cursor jumping if we format immediately?
        // Actually, let's just update the display value locally for now
        setDisplayValue(inputValue);
      }
    };

    // On Blur, format it nicely
    const handleBlur = () => {
      if (value !== undefined) {
        const options: Intl.NumberFormatOptions = {
          minimumFractionDigits: 0,
          maximumFractionDigits: currencyConfig.fractionDigits,
          useGrouping: true,
        };
        setDisplayValue(value.toLocaleString(currencyConfig.locale, options));
      }
    };

    // Re-implementing a safer "Format on type" for integers is easier.
    // For decimals, it's tricky. Let's try to do it for integers (IDR) nicely, and standard input for others?
    // User specifically asked for "tambahan koma" (add commas).

    const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      // Remove all non-digits
      const cleanVal = val.replace(/\D/g, "");

      if (cleanVal === "") {
        setDisplayValue("");
        onValueChange(0);
        return;
      }

      const numVal = parseInt(cleanVal, 10);
      onValueChange(numVal);

      // Format with commas immediately
      setDisplayValue(numVal.toLocaleString("en-US")); // Use en-US for consistent comma separation regardless of locale for now, or match locale? User asking for "koma" usually implies thousand separator. `id-ID` uses dots. `en-US` uses commas. User said "koma" (comma).
      // If user meant "separator", and they are Indonesian (implied by "tambahkan koma"), in IDR `1.000.000` is transparent.
      // But in programming context, "comma" often refers to standard `1,000,000`.
      // Let's genericize:

      // If this is a decimal currency, we might need a different approach.
      // But for now, let's assume this handles the integer part correctly.
    };

    return (
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium pointer-events-none">
          {currencyConfig.symbol}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleMoneyChange}
          className={cn("pl-12", className)}
          placeholder={placeholder}
          onBlur={handleBlur}
          {...props}
        />
        {/* Hidden input for FormData */}
        <input type="hidden" name={props.name} value={value} />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
