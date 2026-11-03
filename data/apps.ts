// Preserve the established catalog while adding focused learning tools.
export * from './core-apps';
import { apps as coreApps } from './core-apps';
import { learningLabs } from './learning-labs';
import { microscopeApp } from './microscope';
import { brainScanApp } from './brain-scan';
import { bodyWorksApp } from './body-works';
import { phetMathApp } from './phet-app';
export const apps = [phetMathApp, bodyWorksApp, brainScanApp, microscopeApp, ...learningLabs, ...coreApps];
