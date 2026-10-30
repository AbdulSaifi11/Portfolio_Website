import { skillGroups } from '../data/skillGroups.js';
import { asset } from '../data/navigation.js';

export default function Skills() {
  return (
    <main className="inner-page skills-page" style={{ '--page-image': `url("${asset('A.jpg')}")` }}>
      <section className="page-heading"><p className="eyebrow">What I work with</p><h1>My <span>skills</span></h1><p>A growing toolkit for designing and building on the web.</p></section>
      <section className="skills-grid">
        {skillGroups.map(({ title, icon, items }, index) => (
          <article className="skill-card" key={title} style={{ '--card-order': index }}>
            <div className="skill-card-top"><i className={icon} aria-hidden="true" /><span>0{index + 1}</span></div>
            <h2>{title}</h2>
            <ul>{items.map((item) => <li key={item}><span className="skill-check"><i className="ri-check-line" /></span>{item}</li>)}</ul>
          </article>
        ))}
      </section>
    </main>
  );
}
