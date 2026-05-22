/**
 * Format angka ke Rupiah (IDR) human-readable
 * Contoh: 3044341083 → "Rp 3,04 M"
 */
export function formatRupiah(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toFixed(1)} T`;
  }
  if (abs >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(2)} M`;
  }
  if (abs >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
  }
  if (abs >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} rb`;
  }
  return `Rp ${value.toFixed(0)}`;
}

/**
 * Format angka ke Rupiah lengkap (tanpa singkatan)
 * Contoh: 3044341083 → "Rp 3.044.341.083"
 */
export function formatRupiahFull(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format persentase
 * Contoh: 0.85 → "85%"  |  1.0 → "100%"
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
