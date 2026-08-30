import React from 'react';
import '../css/aboutUs.css';

const CORE_PILLARS = [
  {
    title: 'Our Mission',
    text: 'To design and manufacture bedrooms, furniture, and kitchens through a design approach defined by proportion, material integrity, precision, and long-term relevance.',
  },
  {
    title: 'Our Goal',
    text: 'To establish Hurfa as a design house defined by clarity and lasting relevance.',
  },
  {
    title: 'Our Philosophy',
    text: 'Design is approached through uncompromising standards, where clarity, material integrity, precision, and enduring quality are essential — not optional.',
  },
];

const PROCESS_STEPS = [
  {
    step: 'Consultation',
    desc: 'During this stage, client meetings are held to discuss the scope of the project, goals, budget, and timeline.',
  },
  {
    step: 'Design & Material Selection',
    desc: 'Based on the client meeting outcome, the design process starts and material selection is finalized.',
  },
  {
    step: 'Production',
    desc: 'Using the latest technologies in cutting & edge banding, ensuring precision and quality. Our on-site installation is carried out with professionalism.',
  },
  {
    step: 'QA & Control',
    desc: 'We prioritize your needs, exceeding expectations with standardized procedures, detailed checklists, and robust QA/QC processes.',
  },
];

const TEAM_MEMBERS = [
  { name: 'Zaid Suaifan', role: 'CEO / Co-Founder', initials: 'ZS' },
  { name: 'Raad Suaifan', role: 'CPO / Co-Founder', initials: 'RS' },
  { name: 'Dana Suaifan', role: 'CCO', initials: 'DS' },
  { name: 'Taimaa Alshibli', role: 'Senior Interior Architect', initials: 'TA' },
  { name: 'Ali Alazzawi', role: 'Technical Interior Architect', initials: 'AA' },
  { name: 'Rami Almani', role: 'Sales Architect', initials: 'RA' },
  { name: 'Fahed Suaifan', role: 'HR Officer', initials: 'FS' },
  { name: 'Mohammad Alhammouri', role: 'IT / Software Engineer', initials: 'MA' },
  { name: 'Ibrahem Alzoubadi', role: 'Operations Supervisor', initials: 'IA' },
  { name: 'Basem Abo-Edaq', role: 'Production Supervisor', initials: 'BA' },
  { name: 'Mohammad Nazeeh', role: 'Inventory / Data Coordinator', initials: 'MN' },
];

function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Narrative */}
      <header className="about-hero">
        <span className="about-eyebrow">Story & Heritage</span>
        <h1>About Us</h1>
        <p>
          Hurfa is a design house and LLC established in Amman, Jordan in 2021,
          specializing in bedrooms, furniture, and kitchens. Guided by architectural
          principles, each collection is defined by proportion, material integrity,
          precision, longevity, and functional clarity. Our boutique on Mecca Street
          presents these collections within a controlled architectural environment.
        </p>
      </header>

      {/* Signature Tagline */}
      <section className="about-tagline-section" aria-label="Brand Vision">
        <h2 className="about-tagline">Design That Endures.</h2>
      </section>

      {/* Info Cards: Mission, Goal, Philosophy */}
      <section className="about-cards-section" aria-label="Core Pillars">
        <div className="about-cards-grid">
          {CORE_PILLARS.map((pillar) => (
            <article key={pillar.title} className="about-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Our Process */}
      <section className="about-process-section" aria-label="Craftsmanship Process">
        <div className="about-section-header">
          <span className="about-eyebrow">Methodology</span>
          <h2>Our Process</h2>
        </div>

        <div className="about-process-grid">
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className="about-process-step">
              <div className="dot" />
              <h3>{item.step}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Organization Structure Tree */}
      <section className="about-org-section" aria-label="Organization Structure">
        <h2>Organization Structure</h2>
        <div className="about-underline" />
        <div className="org-tree">
          <ul>
            <li>
              <div className="org-node">
                <strong>CEO</strong>
              </div>
              <ul>
                <li>
                  <div className="org-node">
                    <strong>CCO</strong>
                  </div>
                  <ul>
                    <li>
                      <div className="org-node">
                        <strong>Marketing</strong>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="org-node">
                    <strong>CPO</strong>
                  </div>
                  <ul>
                    <li>
                      <div className="org-node">
                        <strong>Inventory</strong>
                        <span>Coordinator</span>
                      </div>
                    </li>
                    <li>
                      <div className="org-node">
                        <strong>Operations</strong>
                        <span>Team</span>
                      </div>
                    </li>
                    <li>
                      <div className="org-node">
                        <strong>Design</strong>
                        <span>Architect</span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="about-team-section" aria-label="Team Members">
        <div className="about-section-header">
          <span className="about-eyebrow">People</span>
          <h2>Our Team</h2>
        </div>

        <div className="about-team-grid">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="about-team-member">
              <div className="about-team-avatar">
                {member.initials}
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;