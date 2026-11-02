// Preserve the established catalog while adding focused learning tools.
export * from './core-apps';
import { apps as coreApps } from './core-apps';
import { learningLabs } from './learning-labs';
import { microscopeApp } from './microscope';
import { brainScanApp } from './brain-scan';
export const apps = [brainScanApp, microscopeApp, ...learningLabs, ...coreApps];
