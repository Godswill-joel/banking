export function useFormatPrice() {
  const formatUSD = (
    value: string | number | null | undefined,
    showSymbol: boolean = true
  ) => {
    const numericValue = Number(value ?? 0);

    if (isNaN(numericValue)) {
      return showSymbol ? "$0" : "0";
    }

    const rounded = Math.round(numericValue);

    const formatted = rounded.toLocaleString("en-US");

    return showSymbol ? `$${formatted}` : formatted;
  };

  return { formatUSD };
}