// Keep the established catalog intact; add new educational tools separately.
export * from './core-apps';
import { apps as coreApps } from './core-apps';
import { learningLabs } from './learning-labs';
export const apps = [...learningLabs, ...coreApps];
