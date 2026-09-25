'use client';

import { useState } from 'react';
import { accentFor } from '@/lib/board';
import type { Profile } from '@/lib/types';
import FlipCard from './FlipCard';

function Avatar({ username, name, size }: { username: string; name: string; size: number }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  if (failed) {
    return (
      <div className="cc-avatar cc-avatar--initials" style={{ width: size, height: size }}>
        {initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cc-avatar"
      src={`https://github.com/${username}.png?size=${size * 2}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const stop = (e: React.PointerEvent) => e.stopPropagation();

export default function ContributorCard({ profile, compact = false, isNew = false }: { profile: Profile; compact?: boolean; isNew?: boolean }) {
  const accent = accentFor(profile.github_username);
  const width = compact ? 200 : 240;
  const height = compact ? 270 : 320;

  const front = (
    <div className="cc-face cc-front" style={{ '--accent': accent } as React.CSSProperties}>
      <div className="cc-top">
        <span className="cc-batch">Batch &apos;{String(profile.batch_year).slice(-2)}</span>
        {profile.language && <span className="cc-lang">{profile.language}</span>}
      </div>
      <div className="cc-ring">
        <Avatar username={profile.github_username} name={profile.name} size={compact ? 76 : 96} />
      </div>
      <h3 className="cc-name">{profile.name}</h3>
      <p className="cc-user">@{profile.github_username}</p>
      <p className="cc-hint">tap to flip</p>
    </div>
  );

  const back = (
    <div className="cc-face cc-back" style={{ '--accent': accent } as React.CSSProperties}>
      <p className="cc-bio">{profile.bio}</p>
      <div className="cc-tags">
        {profile.interests.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
      {profile.fun_fact && <p className="cc-fact">{profile.fun_fact}</p>}
      <div className="cc-links">
        <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer" onPointerDown={stop}>
          GitHub
        </a>
        <a href={`/u/${profile.github_username}`} onPointerDown={stop}>
          Share
        </a>
        {profile.link && (
          <a href={profile.link} target="_blank" rel="noreferrer nofollow" onPointerDown={stop}>
            Website
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className={isNew ? 'cc cc--new' : 'cc'} style={{ '--accent': accent } as React.CSSProperties}>
      <FlipCard
        front={front}
        back={back}
        width={width}
        height={height}
        radius={18}
        background="#111113"
        color="#f4f4f5"
        tiltMax={10}
        glareOpacity={0.14}
        ariaLabel={`${profile.name}'s card. Press to flip.`}
      />
    </div>
  );
}
