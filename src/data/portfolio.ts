import type { IconType } from 'react-icons';
import {
  TiSocialDribbble,
  TiSocialFacebookCircular,
  TiSocialInstagramCircular,
  TiSocialLinkedinCircular,
  TiSocialTwitterCircular,
  TiSocialYoutubeCircular,
} from 'react-icons/ti';

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
    phone: string;
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
}

export const navigation: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const meta = {
  title: 'Laura Rivera · Graphic Designer',
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
    "Partnering with founders, product teams, and marketers to craft visual narratives that are as strategic as they are expressive. From global launches to intimate rebrands, I translate ideas into memorable experiences.",
  location: 'Austin, Texas',
  availability: 'Open for collaborations in Q1 2026',
  resumeUrl: 'https://www.google.com/',
  social: [
    { label: 'Dribbble', href: 'https://dribbble.com/', icon: TiSocialDribbble },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: TiSocialInstagramCircular },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: TiSocialLinkedinCircular },
    { label: 'Twitter', href: 'https://twitter.com/', icon: TiSocialTwitterCircular },
    { label: 'Facebook', href: 'https://www.facebook.com/', icon: TiSocialFacebookCircular },
    { label: 'YouTube', href: 'https://www.youtube.com/', icon: TiSocialYoutubeCircular },
  ],
  metrics: [
    { label: 'Years in branding', value: '10+' },
    { label: 'Campaign launches', value: '45' },
    { label: 'Design awards', value: '12' },
  ],
};

export const expertise: SkillArea[] = [
  {
    title: 'Design Systems',
    summary:
      'Inclusive, responsive systems that scale from pitch decks to immersive product ecosystems while preserving brand personality.',
    tags: ['Brand foundations', 'UI kits', 'Accessibility'],
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
    title: 'Experience Design',
    summary:
      'Cross-functional collaboration with product and UX teams to prototype, test, and iterate experiences with measurable impact.',
    tags: ['Product UX', 'Design ops', 'Research synthesis'],
  },
  {
    title: 'Creative Facilitation',
    summary:
      'Workshops, sprints, and stakeholder alignment sessions that turn complex feedback into clear, actionable next steps.',
    tags: ['Design sprints', 'Stakeholder alignment', 'Team leadership'],
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
    summary: 'Rapid product prototypes with interactive flows for stakeholder walkthroughs.',
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
    'Designing brand moments for teams who believe craft and strategy belong in the same conversation.',
  contact: {
    email: 'hello@laurarivera.design',
    phone: '+1 (123) 456-7890',
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
      'Building systems, design files, prototypes, and motion references with production-ready detail.',
  },
  {
    title: 'Launch & Stewardship',
    description:
      'Partnering through rollout, tooling handoff, and post-launch refinement to keep the work resonant.',
  },
];

export const featuredWork: CaseStudy[] = [
  {
    title: 'Nova Wellness Rebrand',
    industry: 'Healthcare',
    summary:
      'Visual identity and launch system for a wellness brand expanding nationally, including packaging, signage, and digital collateral.',
    result: '30% lift in campaign recall and a refreshed retail presence within six weeks.',
  },
  {
    title: 'Orbit SaaS Launch',
    industry: 'Technology',
    summary:
      'Full go-to-market creative for a collaborative SaaS platform spanning product UI, pitch decks, and integrated marketing materials.',
    result: 'Helped secure Series B funding and increased product trial signups by 2.4x.',
  },
  {
    title: 'Muse Festival Experience',
    industry: 'Entertainment',
    summary:
      'Immersive visual experience with environmental graphics, merchandise, and real-time motion content for a three-day art festival.',
    result: 'Sold-out attendance with 60% growth in social engagement year over year.',
  },
];