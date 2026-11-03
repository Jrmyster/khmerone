/** Shared, credential-free limits used by the browser and Worker. */
export const AUDIO_TEXT_LIMIT = 2000;
export const AUDIO_VOICES = ["km-KH-SreymomNeural", "km-KH-PisethNeural"] as const;
export type AudioVoice = typeof AUDIO_VOICES[number];
export type AudioSpeed = "normal" | "slower";
export type AudioInput = { text: string; voice: AudioVoice; speed: AudioSpeed };

export function validAudioInput(value: unknown): value is AudioInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return typeof input.text === "string" && input.text.trim().length > 0
    && Array.from(input.text).length <= AUDIO_TEXT_LIMIT
    // Reject characters not permitted in XML 1.0, including unpaired surrogates.
    && !/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/u.test(input.text)
    && AUDIO_VOICES.includes(input.voice as AudioVoice)
    && (input.speed === "normal" || input.speed === "slower");
}

export function audioSsml(input: AudioInput): string {
  const escaped = input.text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]!);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="km-KH"><voice name="${input.voice}"><prosody rate="${input.speed === "slower" ? "-20%" : "0%"}">${escaped}</prosody></voice></speak>`;
}
