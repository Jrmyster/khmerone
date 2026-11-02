'use client';
import { useSyncExternalStore } from 'react';
const subscribe = (callback: () => void) => { window.addEventListener('khmerone:data-change', callback); return () => window.removeEventListener('khmerone:data-change', callback); };
// Conservative SSR snapshot: never download decorative media before knowing the preference.
export function useLowData() { return useSyncExternalStore(subscribe, () => document.documentElement.dataset.lowData !== 'false', () => true); }
