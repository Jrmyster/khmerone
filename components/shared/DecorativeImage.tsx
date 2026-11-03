'use client';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { useLowData } from '@/hooks/useLowData';
export function DecorativeImage(props: ComponentProps<typeof Image>) { return useLowData() ? null : <Image {...props} alt={props.alt} />; }
