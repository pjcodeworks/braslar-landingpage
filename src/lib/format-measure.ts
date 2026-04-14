/**
 * Formata valores como `"27,470 kg"` ou `"70,5 cm"` removendo zeros finais
 * após a vírgula decimal (notação pt-BR).
 */
export function formatMeasureDisplay(value: string): string {
  const s = value.trim();
  const m = s.match(/^(\d+)(,(\d+))?\s*(cm|kg)$/i);
  if (!m) {
    return s;
  }
  const intPart = m[1];
  const fracPart = m[3];
  const unit = m[4].toLowerCase();
  if (fracPart === undefined) {
    return `${intPart} ${unit}`;
  }
  const trimmedFrac = fracPart.replace(/0+$/, "");
  const num = trimmedFrac ? `${intPart},${trimmedFrac}` : intPart;
  return `${num} ${unit}`;
}
