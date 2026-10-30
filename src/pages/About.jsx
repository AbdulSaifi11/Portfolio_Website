import { useState } from 'react';
import { aboutSections } from '../data/aboutSections.jsx';
import { asset } from '../data/navigation.js';
import WelcomeModal from '../components/WelcomeModal.jsx';

export default function About() {
  const [welcomeOpen, setWelcomeOpen] = useState(() => !sessionStorage.getItem('welcomeSeen'));
  const [expanded, setExpanded] = useState(0);
  const closeWelcome = () => { sessionStorage.setItem('welcomeSeen', 'true'); setWelcomeOpen(false); };

  return (
    <main className="inner-page about-page" style={{ '--page-image': `url("${asset('back.jpg')}")` }}>
      <section className="page-heading"><p className="eyebrow">A little context</p><h1>About <span>me</span></h1><p>My background, learning journey and work so far.</p></section>
      <section className="about-layout">
        <div className="about-photo"><img src={asset('Me.jpeg')} alt="Abdul Salam Saifi outdoors" loading="lazy" decoding="async" /><div className="photo-caption">Abdul Salam Saifi <span>Frontend developer</span></div></div>
        <div className="accordion-list">
          {aboutSections.map(({ title, body }, index) => (
            <article className={`accordion-card ${expanded === index ? 'expanded' : ''}`} key={title}>
              <button type="button" className="accordion-trigger" aria-expanded={expanded === index} onClick={() => setExpanded(expanded === index ? -1 : index)}>
                <span className="accordion-index">0{index + 1}</span><span>{title}</span><i className={expanded === index ? 'ri-subtract-line' : 'ri-add-line'} />
              </button>
              {expanded === index && <div className="accordion-content">{body}</div>}
            </article>
          ))}
        </div>
      </section>
      {welcomeOpen && <WelcomeModal onClose={closeWelcome} />}
    </main>
  );
}
