import type { IconType } from 'react-icons';

import adobeAfterEffects from '../assets/svgs/after-effects.svg';
import adobeIllustrator from '../assets/svgs/adobe-illustrator.svg';
import adobeInDesign from '../assets/svgs/adobe-indesign.svg';
import adobePhotoshop from '../assets/svgs/adobe-photoshop.svg';
import adobePremierePro from '../assets/svgs/premiere-pro.svg';
import adobeXd from '../assets/svgs/adobe-xd.svg';

const currentYear = new Date().getFullYear();

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
}

export interface Metric {
  label: string;
  value: string;
}

export interface HeroContent {
  name: string;
  title: string;
  headline: string;
  description: string;
  location: string;
  availability: string;
  resumeUrl: string;
  social: SocialLink[];
  metrics: Metric[];
}

export interface SkillArea {
  title: string;
  summary: string;
  tags: string[];
}

export interface Tool {
  name: string;
  logo: string;
  accent: string;
  summary: string;
}

export interface FooterContent {
  studioNote: string;
  contact: {
    email: string;
    phone?: string;
    studio: string;
  };
  nav: NavItem[];
  social: SocialLink[];
  copyright: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface CaseStudy {
  title: string;
  industry: string;
  summary: string;
  result: string;
  overview: string;
  timeline: string;
  deliverables: string[];
  impact: string;
}

export const navigation: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const meta = {
  title: 'Laura Rivera · Senior Graphic Designer',
  description:
    'Portfolio of Laura Rivera, a senior graphic designer crafting brand systems, campaign narratives, and immersive visual experiences.',
  keywords: [
    'graphic design',
    'brand identity',
    'campaign design',
    'art direction',
    'motion design',
  ],
  url: 'https://laurarivera.design',
};

export const hero: HeroContent = {
  name: 'Laura Rivera',
  title: 'Senior Graphic Designer',
  headline: 'I build brand universes that stay with people long after the campaign ends.',
  description:
    'Partnering with marketing teams, founders, and cultural organizations to craft visual systems that feel distinctive, polished, and ready for launch. From brand refreshes to campaign rollouts, I translate strategy into memorable design.',
  location: 'Austin, Texas',
  availability: 'Available for freelance, contract, and select in-house collaborations in 2026',
  resumeUrl: '#contact',
  social: [],
  metrics: [
    { label: 'Primary focus', value: 'Brand Identity' },
    { label: 'Core strength', value: 'Campaign Systems' },
    { label: 'Formats', value: 'Print + Digital' },
  ],
};

export const expertise: SkillArea[] = [
  {
    title: 'Design Systems',
    summary:
      'Flexible visual systems that scale across campaign rollouts, presentation decks, web graphics, and print without losing brand personality.',
    tags: ['Brand guidelines', 'Template systems', 'Accessibility'],
  },
  {
    title: 'Campaign Storytelling',
    summary:
      'Narrative-driven visuals for launches, events, and content marketing that bring teams together around a clear creative direction.',
    tags: ['Art direction', 'Motion cues', 'Content design'],
  },
  {
    title: 'Identity & Packaging',
    summary:
      'Research-led identity design with tactile extensions, packaging, and merch systems that delight on shelves and in feeds.',
    tags: ['Print production', 'Packaging', 'Materials'],
  },
  {
    title: 'Typography Craft',
    summary:
      'Deep love for type that balances expression and legibility across digital and print, with custom treatments when the story needs it.',
    tags: ['Custom lettering', 'Editorial layouts', 'Type pairing'],
  },
  {
    title: 'Editorial & Spatial Design',
    summary:
      'Editorial layouts, presentation design, and environmental graphics that translate a brand story across physical and digital touchpoints.',
    tags: ['Editorial systems', 'Environmental graphics', 'Presentation design'],
  },
  {
    title: 'Creative Leadership',
    summary:
      'Clear creative direction, review management, and production coordination that keep stakeholders aligned and the work moving forward.',
    tags: ['Client presentations', 'Production alignment', 'Team leadership'],
  },
];

export const toolkit: Tool[] = [
  {
    name: 'Adobe Photoshop',
    logo: adobePhotoshop,
    accent: '#38bdf8',
    summary: 'Photo illustration, retouching, matte painting, and experimental composites for motion briefs.',
  },
  {
    name: 'Adobe Illustrator',
    logo: adobeIllustrator,
    accent: '#f97316',
    summary: 'Vector systems, iconography, packaging dielines, and scalable brand assets.',
  },
  {
    name: 'Adobe XD',
    logo: adobeXd,
    accent: '#f472b6',
    summary: 'Quick mockups and click-through layouts for campaign pages, presentation flows, and stakeholder reviews.',
  },
  {
    name: 'Adobe InDesign',
    logo: adobeInDesign,
    accent: '#f43f5e',
    summary: 'Editorial layouts, magazines, lookbooks, and long-form documentation with flair.',
  },
  {
    name: 'After Effects',
    logo: adobeAfterEffects,
    accent: '#818cf8',
    summary: 'Motion graphics, kinetic typography, and animated stories for immersive campaigns.',
  },
  {
    name: 'Premiere Pro',
    logo: adobePremierePro,
    accent: '#a855f7',
    summary: 'Story-driven edits, sizzle reels, and social-ready cuts built in lockstep with audio.',
  },
];

export const footer: FooterContent = {
  studioNote:
    'Senior graphic design direction for identity systems, launch campaigns, editorial storytelling, and production-ready brand assets.',
  contact: {
    email: 'hello@laurarivera.design',
    studio: 'Austin · Remote-friendly',
  },
  nav: navigation,
  social: hero.social,
  copyright: `© 2013–${currentYear} Laura Rivera. Made with intention.`,
};

export const process: ProcessStep[] = [
  {
    title: 'Discovery & Insights',
    description:
      'Immersive workshops, audience mapping, and brand audits to surface what makes the story worth telling.',
  },
  {
    title: 'Concept Development',
    description:
      'Mood explorations, tonal territories, and narrative arcs that set a clear bar for where the creative is heading.',
  },
  {
    title: 'Design Production',
    description:
      'Building brand systems, print-ready files, campaign layouts, and motion references with production-ready detail.',
  },
  {
    title: 'Launch & Stewardship',
    description:
      'Partnering through rollout, production handoff, vendor coordination, and post-launch refinement to keep the work resonant.',
  },
];

export const featuredWork: CaseStudy[] = [
  {
    title: 'Nova Wellness Rebrand',
    industry: 'Healthcare',
    summary:
      'Visual identity and launch system for a wellness brand expanding nationally, including packaging, signage, and digital collateral.',
    result: '30% lift in campaign recall and a refreshed retail presence within six weeks.',
    overview:
      'Nova needed a sharper premium position before entering new regional retail chains. The system had to feel calm and clinical without flattening the brand into generic wellness tropes.',
    timeline: '6-week sprint',
    deliverables: ['Identity refresh', 'Packaging system', 'Retail signage', 'Launch campaign'],
    impact:
      'The refreshed identity created a more cohesive shelf presence, gave the internal team a repeatable rollout system, and improved campaign recall during the first six weeks of launch.',
  },
  {
    title: 'Orbit Platform Launch',
    industry: 'B2B Technology',
    summary:
      'Launch identity and campaign system for a technology platform spanning keynote decks, web visuals, paid social, and sales collateral.',
    result: 'Strengthened launch recognition across sales and marketing touchpoints and lifted demo requests by 2.4x.',
    overview:
      'Orbit needed a sharper visual language before a national launch. The brief focused on aligning messaging, presentation design, and campaign assets into one coherent system.',
    timeline: '10-week launch window',
    deliverables: ['Launch identity', 'Keynote deck', 'Web campaign graphics', 'Sales collateral'],
    impact:
      'A consistent rollout system helped the team present the platform with more polish, improved campaign consistency, and gave sales stronger materials to support outreach.',
  },
  {
    title: 'Muse Festival Experience',
    industry: 'Entertainment',
    summary:
      'Immersive visual experience with environmental graphics, merchandise, and real-time motion content for a three-day art festival.',
    result: 'Sold-out attendance with 60% growth in social engagement year over year.',
    overview:
      'Muse wanted an identity that could live on-site, on merch, and across live social coverage without losing its sense of spontaneity. The system balanced expressive art direction with practical production constraints.',
    timeline: '8-week production cycle',
    deliverables: ['Environmental graphics', 'Motion content', 'Merch collection', 'Social launch assets'],
    impact:
      'The visual system gave the festival a stronger sense of place, produced highly shareable brand moments on-site, and supported sold-out attendance with stronger year-over-year engagement.',
  },
];