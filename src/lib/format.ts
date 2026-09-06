export function formatPercent(numerator: number, denominator: number): string {
  if (denominator <= 0) return '0%';
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

export function formatRating(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return Math.round(value).toLocaleString();
}

export function formatDelta(value: number): string {
  const rounded = Math.round(value);
  return rounded >= 0 ? `+${rounded}` : String(rounded);
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleString(undefined, {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(value: string | Date): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
