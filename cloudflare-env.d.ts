declare namespace Cloudflare {
  interface Env {
    LEARNING_DB?: D1Database;
    LEARNING_FILES?: R2Bucket;
    QUIZ_ROOMS?: DurableObjectNamespace;
    LEARNING_ADMIN_KEY?: string;
    AZURE_TRANSLATOR_KEY?: string;
    AZURE_TRANSLATOR_REGION?: string;
    LEARNING_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
    ROOM_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
    DB?: D1Database;
    BUCKET?: R2Bucket;
    AZURE_SPEECH_KEY?: string;
    AZURE_SPEECH_REGION?: string;
    SPEECH_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  }
}
