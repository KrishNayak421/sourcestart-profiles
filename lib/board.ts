import type { Profile } from './types';

export function sortProfiles(profiles: Profile[]): Profile[] {
  return [...profiles].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

export function topInterests(profiles: Profile[], n = 8): { interest: string; count: number }[] {
  const counts = new Map<string, { interest: string; count: number }>();
  for (const p of profiles) {
    for (const interest of p.interests) {
      const key = interest.trim().toLowerCase();
      const entry = counts.get(key) ?? { interest: interest.trim(), count: 0 };
      entry.count++;
      counts.set(key, entry);
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.interest.localeCompare(b.interest))
    .slice(0, n);
}

export function matchesSearch(profile: Profile, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [profile.name, profile.github_username, profile.language ?? '', ...profile.interests];
  return haystack.some((field) => field.toLowerCase().includes(q));
}

// Newest first, for the TV view. Profiles without a date go last, alphabetically.
export function newestFirst(profiles: Profile[]): Profile[] {
  return [...profiles].sort(
    (a, b) => (b.joined_at ?? '').localeCompare(a.joined_at ?? '') || a.name.localeCompare(b.name),
  );
}

export function findProfile(profiles: Profile[], username: string): Profile | undefined {
  return profiles.find((p) => p.github_username.toLowerCase() === username.toLowerCase());
}

export const profileKey = (p: Profile) => p.github_username.toLowerCase();

// Usernames in `next` that weren't in `known`, oldest first.
export function newArrivals(known: Set<string>, next: Profile[]): string[] {
  return next
    .filter((p) => !known.has(profileKey(p)))
    .sort((a, b) => (a.joined_at ?? '').localeCompare(b.joined_at ?? ''))
    .map(profileKey);
}

// Adds anyone in `next` to `current`, keeping everyone already seen. Different
// server instances can briefly disagree, and the TV shouldn't flicker 31 -> 30 -> 31.
export function mergeProfiles(current: Profile[], next: Profile[]): Profile[] {
  const byKey = new Map(current.map((p) => [profileKey(p), p]));
  for (const p of next) byKey.set(profileKey(p), p);
  return [...byKey.values()];
}

// Shorter spotlights when a burst of merges is waiting.
export function spotlightDuration(waiting: number): number {
  return waiting > 3 ? 2000 : 4500;
}

// `arrivals` is newest first. The spotlight plays them oldest first, one at a time.
export function nextSpotlight(arrivals: string[], shown: string[]): string | undefined {
  return [...arrivals].reverse().find((k) => !shown.includes(k));
}

export function hasInterest(profile: Profile, interest: string | null): boolean {
  return !interest || profile.interests.some((i) => i.trim().toLowerCase() === interest.trim().toLowerCase());
}

// A stable accent colour per person, so the same card always looks the same.
export function accentFor(username: string): string {
  let hash = 0;
  for (const c of username.toLowerCase()) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360} 85% 65%)`;
}
