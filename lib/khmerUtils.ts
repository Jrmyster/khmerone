/** Remove spacing, invisible format characters and punctuation while preserving Khmer vowel marks. */
export function normalizeKhmerInput(input: string): string {
  return (input || "").normalize("NFC").toLowerCase().replace(/[\s\p{Cf}\p{P}\p{S}]+/gu, "");
}

const KHMERONE_ALIASES = new Set([
  "ខ្មែរវ័ន", "ខ្មែរ វ័ន", "khmerone", "khmer1", "khmerone.com", "www.khmerone.com",
].map(normalizeKhmerInput));

export function isKhmerOneAlias(input: string): boolean {
  const normalized = normalizeKhmerInput(input);
  return Boolean(normalized) && KHMERONE_ALIASES.has(normalized);
}
