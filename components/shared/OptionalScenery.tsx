'use client';
import { CosmicJungleBackground } from '@/components/CosmicJungleBackground';
import { useLowData } from '@/hooks/useLowData';
export function OptionalScenery() { return useLowData() ? null : <CosmicJungleBackground />; }
