import { asset } from '../data/navigation.js';
import SocialLinks from '../components/SocialLinks.jsx';
import SpaLink from '../routing/SpaLink.jsx';

const resume = asset('Abdul_Salam_Saifi.pdf');

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-copy">
        <div className="hero-intro">
          <p className="eyebrow">Hello, welcome to my portfolio</p>
          <h1>Hi, I am <span>Abdul Salam Saifi</span></h1>
          <p className="role">Frontend Developer <b>/</b> React Developer</p>
          <p className="hero-description">I build modern, responsive web interfaces and enjoy turning ideas into useful digital experiences.</p>
          <div className="hero-actions">
            <SpaLink className="button button-primary" href="/about">A little about me <i className="ri-arrow-right-line" /></SpaLink>
            <a className="button button-outline" href={resume} target="_blank" rel="noreferrer">View resume <i className="ri-external-link-line" /></a>
          </div>
        </div>
        <div className="hero-social"><span>Find me online</span><SocialLinks /></div>
      </section>
      <section className="hero-portrait" aria-label="Portrait of Abdul Salam Saifi">
        <div className="portrait-frame"><img src={asset('abdul.png')} alt="Abdul Salam Saifi in a suit" fetchPriority="high" decoding="async" /></div>
        <div className="portrait-note"><span className="note-dot" /> Open to learning and new opportunities</div>
      </section>
    </main>
  );
}
