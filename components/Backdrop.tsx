'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ShapeWaves = dynamic(() => import('./ShapeWaves'), { ssr: false });
const Dither = dynamic(() => import('./Dither'), { ssr: false });

// ShapeWaves needs WebGPU. Where that's missing (or fails), Dither (WebGL) is used instead.
export function HeroBackdrop({ text, fontFamily }: { text: string; fontFamily: string }) {
  const [webgpu, setWebgpu] = useState<boolean | null>(null);
  useEffect(() => setWebgpu('gpu' in navigator), []);
  if (webgpu === null) return null;
  if (!webgpu) {
    return (
      <>
        <Dither waveColor={[0.32, 0.32, 0.32]} colorNum={4} pixelSize={3} waveSpeed={0.03} mouseRadius={0.35} />
        <div className="hero-title" aria-hidden="true">
          {text}
        </div>
      </>
    );
  }
  return (
    <ShapeWaves
      text={text}
      fontFamily={fontFamily}
      fontWeight={700}
      textSize={0.26}
      cellSize={11}
      color="#8a8a8a"
      hoverColor="#ffffff"
      fade={0.3}
      onError={(error: Error) => {
        console.error('ShapeWaves failed, falling back to Dither:', error);
        setWebgpu(false);
      }}
    />
  );
}

// Only mounts Dither while it's on screen, so it isn't rendering frames nobody can see.
export function LazyDither(props: React.ComponentProps<typeof Dither>) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: '200px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }}>{onScreen && <Dither {...props} />}</div>;
}

// The contributor count drawn into the dot field. The intro replays every time it changes.
export function LiveCounter({ count, fontFamily }: { count: number; fontFamily: string }) {
  const [webgpu, setWebgpu] = useState<boolean | null>(null);
  useEffect(() => setWebgpu('gpu' in navigator), []);
  if (webgpu === null) return null;
  if (!webgpu) return <div className="live-counter-fallback">{count}</div>;
  return (
    <ShapeWaves
      text={String(count)}
      fontFamily={fontFamily}
      fontWeight={800}
      textSize={0.8}
      cellSize={9}
      color="#8a8a8a"
      hoverColor="#a3e635"
      fade={0.15}
      introKey={count}
      interactive={false}
      onError={(error: Error) => {
        console.error('ShapeWaves failed, showing a plain counter:', error);
        setWebgpu(false);
      }}
    />
  );
}
