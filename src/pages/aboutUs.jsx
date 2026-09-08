import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../css/aboutUs.css';

function AboutUs() {
  const { t } = useLanguage();

  const corePillars = [
    {
      title: t('mission', 'Our Mission'),
      text: t(
        'missionText',
        'To design and manufacture bedrooms, furniture, and kitchens through a design approach defined by proportion, material integrity, precision, and long-term relevance.'
      ),
    },
    {
      title: t('goal', 'Our Goal'),
      text: t(
        'goalText',
        'To establish Hurfa as a design house defined by clarity and lasting relevance.'
      ),
    },
    {
      title: t('philosophy', 'Our Philosophy'),
      text: t(
        'philosophyText',
        'Design is approached through uncompromising standards, where clarity, material integrity, precision, and enduring quality are essential — not optional.'
      ),
    },
  ];

  const processSteps = [
    {
      step: t('consultation', 'Consultation'),
      desc: t(
        'consultationText',
        'During this stage, client meetings are held to discuss the scope of the project, goals, budget, and timeline.'
      ),
    },
    {
      step: t('designSelection', 'Design & Material Selection'),
      desc: t(
        'designText',
        'Based on the client meeting outcome, the design process starts and material selection is finalized.'
      ),
    },
    {
      step: t('production', 'Production'),
      desc: t(
        'productionText',
        'Using the latest technologies in cutting & edge banding, ensuring precision and quality. Our on-site installation is carried out with professionalism.'
      ),
    },
    {
      step: t('qa', 'QA & Control'),
      desc: t(
        'qaText',
        'We prioritize your needs, exceeding expectations with standardized procedures, detailed checklists, and robust QA/QC processes.'
      ),
    },
  ];

  const teamMembers = [
    { name: t('nameZaid', 'Zaid Suaifan'), role: t('roleCeo', 'CEO / Co-Founder'), initials: 'ZS' },
    { name: t('nameRaad', 'Raad Suaifan'), role: t('roleCpo', 'CPO / Co-Founder'), initials: 'RS' },
    { name: t('nameDana', 'Dana Suaifan'), role: t('roleCco', 'CCO'), initials: 'DS' },
    { name: t('nameTaimaa', 'Taimaa Alshibli'), role: t('roleSeniorArch', 'Senior Interior Architect'), initials: 'TA' },
    { name: t('nameAli', 'Ali Alazzawi'), role: t('roleTechArch', 'Technical Interior Architect'), initials: 'AA' },
    { name: t('nameRami', 'Rami Almani'), role: t('roleSalesArch', 'Sales Architect'), initials: 'RA' },
    { name: t('nameFahed', 'Fahed Suaifan'), role: t('roleHr', 'HR Officer'), initials: 'FS' },
    { name: t('nameMohammad', 'Mohammad Alhammouri'), role: t('roleIt', 'IT / Software Engineer'), initials: 'MA' },
    { name: t('nameIbrahem', 'Ibrahem Alzoubadi'), role: t('roleOpSup', 'Operations Supervisor'), initials: 'IA' },
    { name: t('nameBasem', 'Basem Abo-Edaq'), role: t('roleProdSup', 'Production Supervisor'), initials: 'BA' },
    { name: t('nameNazeeh', 'Mohammad Nazeeh'), role: t('roleInv', 'Inventory / Data Coordinator'), initials: 'MN' },
  ];

  return (
    <div className="about-page">
      {/* Hero Narrative */}
      <header className="about-hero">
        <span className="about-eyebrow">{t('storyAndHeritage', 'Story & Heritage')}</span>
        <h1>{t('aboutTitle', 'About Us')}</h1>
        <p>
          {t(
            'aboutText',
            'Hurfa is a design house and LLC established in Amman, Jordan in 2021, specializing in bedrooms, furniture, and kitchens. Guided by architectural principles, each collection is defined by proportion, material integrity, precision, longevity, and functional clarity. Our boutique on Mecca Street presents these collections within a controlled architectural environment.'
          )}
        </p>
      </header>

      {/* Signature Tagline */}
      <section className="about-tagline-section" aria-label="Brand Vision">
        <h2 className="about-tagline">{t('designEndures', 'Design That Endures.')}</h2>
      </section>

      {/* Info Cards: Mission, Goal, Philosophy */}
      <section className="about-cards-section" aria-label="Core Pillars">
        <div className="about-cards-grid">
          {corePillars.map((pillar) => (
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
          <span className="about-eyebrow">{t('methodology', 'Methodology')}</span>
          <h2>{t('process', 'Our Process')}</h2>
        </div>

        <div className="about-process-grid">
          {processSteps.map((item) => (
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
        <h2>{t('orgStructure', 'Organization Structure')}</h2>
        <div className="about-underline" />
        <div className="org-tree">
          <ul>
            <li>
              <div className="org-node">
                <strong>{t('ceo', 'CEO')}</strong>
              </div>
              <ul>
                <li>
                  <div className="org-node">
                    <strong>{t('cco', 'CCO')}</strong>
                  </div>
                  <ul>
                    <li>
                      <div className="org-node">
                        <strong>{t('marketing', 'Marketing')}</strong>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="org-node">
                    <strong>{t('cpo', 'CPO')}</strong>
                  </div>
                  <ul>
                    <li>
                      <div className="org-node">
                        <strong>{t('inventory', 'Inventory')}</strong>
                        <span>{t('coordinator', 'Coordinator')}</span>
                      </div>
                    </li>
                    <li>
                      <div className="org-node">
                        <strong>{t('operations', 'Operations')}</strong>
                        <span>{t('prodTeam', 'Team')}</span>
                      </div>
                    </li>
                    <li>
                      <div className="org-node">
                        <strong>{t('design', 'Design')}</strong>
                        <span>{t('salesArch', 'Architect')}</span>
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
          <span className="about-eyebrow">{t('people', 'People')}</span>
          <h2>{t('ourTeam', 'Our Team')}</h2>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member) => (
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