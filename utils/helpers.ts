/** "Rs. 1,500" -> 1500 */
export function parseRs(text: string): number {
  const m = text.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  if (!m) throw new Error(`Cannot parse price from "${text}"`);
  return Number(m[1]);
}
