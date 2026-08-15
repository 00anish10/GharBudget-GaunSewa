/**
 * Formats a number in the South Asian / Nepali numbering system (lakhs & crores)
 * e.g., 125000 -> "1,25,000", 45300 -> "45,300"
 */
export function formatNepaliNumber(num: number): string {
  if (isNaN(num)) return '0';
  const isNegative = num < 0;
  const absNum = Math.abs(Math.round(num));
  const numStr = absNum.toString();

  if (numStr.length <= 3) {
    return (isNegative ? '-' : '') + numStr;
  }

  // Last 3 digits
  const lastThree = numStr.substring(numStr.length - 3);
  const remaining = numStr.substring(0, numStr.length - 3);

  // Group remaining in pairs of 2
  const paired = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return (isNegative ? '-' : '') + `${paired},${lastThree}`;
}

/**
 * Formats currency with prefix:
 * prefix = 'NPR' -> "NPR 1,25,000"
 * prefix = 'Rs.' -> "Rs. 45,200"
 * prefix = 'रु'  -> "रु 45,000"
 */
export function formatCurrency(
  amount: number,
  prefix: 'NPR' | 'Rs.' | 'रु' = 'NPR',
  showSign: boolean = false
): string {
  const formatted = formatNepaliNumber(Math.abs(amount));
  const sign = amount > 0 && showSign ? '+ ' : amount < 0 && showSign ? '- ' : '';
  return `${sign}${prefix} ${formatted}`;
}

/**
 * Converts a large number to concise "45.3K" or "1.25L" format
 */
export function formatShortNumber(num: number): string {
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toString();
}

/**
 * Formats date into readable string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
