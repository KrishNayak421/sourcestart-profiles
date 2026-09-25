'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { findProfile, newestFirst, nextSpotlight, spotlightDuration } from '@/lib/board';
import type { Profile } from '@/lib/types';
import { useLiveProfiles } from '@/lib/useLiveProfiles';
import { LiveCounter } from './Backdrop';
import ContributorCard from './ContributorCard';
import Spotlight from './Spotlight';

// For the TV: newest first, big counter, and every new arrival gets a few seconds centre stage.
export default function LiveBoard({ initial, qr, repoUrl, fontFamily }: { initial: Profile[]; qr: string; repoUrl: string; fontFamily: string }) {
  const { profiles, arrivals } = useLiveProfiles(initial, 10_000);
  const [spotlit, setSpotlit] = useState<string[]>([]);

  const next = nextSpotlight(arrivals, spotlit);
  const waiting = arrivals.filter((k) => !spotlit.includes(k)).length;
  const current = next ? findProfile(profiles, next) : undefined;

  useEffect(() => {
    if (!next) return;
    // The TV should always show the counter and the newest cards.
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const id = setTimeout(() => setSpotlit((s) => [...s, next]), spotlightDuration(waiting));
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  const ordered = newestFirst(profiles);
  const latest = ordered[0];

  return (
    <main className="live">
      <header className="live-head">
        <div className="live-stats">
          <p className="eyebrow">Source Start · live</p>
          <div className="live-counter" aria-label={`${profiles.length} contributors`}>
            <LiveCounter count={profiles.length} fontFamily={fontFamily} />
          </div>
          <p className="live-label">contributors so far</p>
          {latest && <p className="live-latest">Latest: {latest.name}</p>}
        </div>
        <div className="live-join">
          <p className="live-join-title">Add your card</p>
          <div className="qr" dangerouslySetInnerHTML={{ __html: qr }} role="img" aria-label="QR code linking to the repository" />
          <p>{repoUrl.replace(/^https:\/\//, '')}</p>
        </div>
      </header>

      <div className="grid grid--compact">
        <AnimatePresence initial={false}>
          {ordered.map((p) => (
            <motion.div
              key={p.github_username.toLowerCase()}
              layout
              initial={{ opacity: 0, scale: 0.6, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <ContributorCard profile={p} compact isNew={arrivals.includes(p.github_username.toLowerCase())} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>{current && <Spotlight key={current.github_username} profile={current} />}</AnimatePresence>
    </main>
  );
}
