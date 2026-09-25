import { connection } from 'next/server';
import Board from '@/components/Board';
import Hero from '@/components/Hero';
import JoinPanel from '@/components/JoinPanel';
import { sortProfiles } from '@/lib/board';
import { getProfiles } from '@/lib/profiles';
import { repoUrl } from '@/lib/repo';
import { geist } from '@/lib/fonts';

export default async function Home() {
  await connection();
  const profiles = sortProfiles(await getProfiles());
  return (
    <>
      <Hero count={profiles.length} fontFamily={geist.style.fontFamily} />
      <Board initial={profiles} />
      <JoinPanel repoUrl={repoUrl} />
      <footer className="footer">
        Source Start by CSI SPIT · <a href={repoUrl}>Source on GitHub</a> · <a href="/live">Projector view</a>
      </footer>
    </>
  );
}
