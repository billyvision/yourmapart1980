// Generate human-friendly order number in format: YMA-2025-8H3K9C2D
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar chars: 0,O,1,I
  let randomPart = '';

  // Generate 8 random characters
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `YMA-${year}-${randomPart}`;
}

// Convert dollar amount to cents
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// Convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100;
}

// Format cents as currency string
export function formatCurrency(cents: number, currency: string = 'usd'): string {
  const dollars = centsToDollars(cents);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(dollars);
}
