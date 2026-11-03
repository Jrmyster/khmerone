// Preserve the established catalog while adding focused learning tools.
export * from './core-apps';
import { apps as coreApps } from './core-apps';
import { learningLabs } from './learning-labs';
import { microscopeApp } from './microscope';
import { brainScanApp } from './brain-scan';
import { phetMathApp } from './phet-app';
export const apps = [phetMathApp, brainScanApp, microscopeApp, ...learningLabs, ...coreApps];
