import { HeroBackdrop } from './Backdrop';

export default function Hero({ count, fontFamily }: { count: number; fontFamily: string }) {
  return (
    <header className="hero">
      <div className="hero-bg">
        <HeroBackdrop text="SOURCESTART" fontFamily={fontFamily} />
      </div>
      <div className="hero-content">
        <p className="eyebrow">CSI SPIT · Source Start 2026</p>
        <h1 className="sr-only">Source Start</h1>
        <p className="tagline">From first commit to open source contributor.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#join">Add your card</a>
          <a className="button" href="#board">See all {count}</a>
        </div>
      </div>
    </header>
  );
}
