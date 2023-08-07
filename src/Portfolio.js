import {
  TiSocialDribbble,
  TiSocialFacebookCircular,
  TiSocialTwitterCircular,
  TiSocialInstagramCircular,
  TiSocialLinkedinCircular,
  TiSocialYoutubeCircular
} from 'react-icons/ti';

import adobePhotoshop from './components/Assets/svgs/adobe-photoshop.svg';
import adobeIllustrator from './components/Assets/svgs/adobe-illustrator.svg';
import adobeXd from './components/Assets/svgs/adobe-xd.svg';
import adobeInDesign from './components/Assets/svgs/adobe-indesign.svg';
import adobeAfterEffects from './components/Assets/svgs/after-effects.svg';
import adobePremierePro from './components/Assets/svgs/premiere-pro.svg';

// SEO
const seo = {
  title: 'Laura | Portfolio',
  description: 'Laura\'s portfolio',
  canonical: 'https://laura.netlify.app/',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://laura.netlify.app/',
    title: 'Laura | Portfolio',
    description: 'Laura\'s portfolio',
    images: [
      {
        url: 'https://laura.netlify.app/images/og.jpg',
        alt: 'Laura\'s portfolio',
        width: 1280,
        height: 720
      }
    ]
  }
};

// Navbar
const navbar = {
  logo: 'logo.svg',
  navLinks: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Education',
      url: '/education',
    },
    {
      name: 'Experience',
      url: '/experience',
    },
    {
      name: 'Projects',
      url: '/projects',
    },
    {
      name: 'Contact',
      url: '/contact',
    },
  ],
};

// Home Page
const greeting = {
  username: 'Laura',
  profession: 'Graphic Designer',
  description: "Welcome to my Portfolio! I can help your company create stunning visuals. As someone who has worked in marketing and graphic design for over a decade, I know what brands need to capture their audiences' attention.With my powerful design skills and knack for marketing, I have the right background for your brand's needs.",
  resumeLink: 'https://www.google.com/',
};

const socialMedia = {
  data: [
    {
      name: 'facebook',
      icon: <TiSocialFacebookCircular />,
      url: 'https://www.facebook.com/',
    },
    {
      name: 'instagram',
      icon: <TiSocialInstagramCircular />,
      url: 'https://www.instagram.com/',
    },
    {
      name: 'linkedin',
      icon: <TiSocialLinkedinCircular />,
      url: 'https://www.linkedin.com/',
    },
    {
      name: 'twitter',
      icon: <TiSocialTwitterCircular />,
      url: 'https://twitter.com/',
    },
    {
      name: 'dribbble',
      icon: <TiSocialDribbble />,
      url: 'https://dribbble.com/',
    },
    {
      name: 'youtube',
      icon: <TiSocialYoutubeCircular />,
      url: 'https://www.youtube.com/',
    },
  ]
};

const skills = {
  data: [
    {
      name: 'Design principles',
      description: 'A strong understanding of design principles is essential for any Graphic Designer. Throughout their work, they will strategically use different elements to convey intended messages. Graphic Designers need to know how to bring together lines, color, shape, space, texture, typography, scale, dominance and emphasis, and harmony to create visually appealing and well-structured designs.',
    },
    {
      name: 'Ideation',
      description: 'There are many techniques and skills that Graphic Designers use for the ideation process. Two examples are mood boards and thumbnails. Mood boards are a collection of visuals used to explore new ideas and communicate the tone or direction of a project. Thumbnails are quick, rough sketches that approximate the layout of a design, including key elements like images, headlines, and copy.',
    },
    {
      name: 'Branding',
      description: 'Graphic Designers often build or maintain branding for their client or employer. When working with a brand, they need an in-depth understanding of what makes that brand unique. Then, they need to bring that brand to life through logos, colors, typography, illustration, photography, graphic elements, and more. Graphic Designers should be able to create work that is consistent across platforms and that speaks to the right audience.'
    },
    {
      name: 'Typography',
      description: 'Typography is one of the most important elements of graphic design. The right typography can create meaning and invoke feeling, while the wrong typography can be distracting or repel customers. Graphic Designers need to be skilled in everything from selecting the right font for a project to typesetting, kerning, tracking, and leading.',
    },
    {
      name: 'Designing for Print',
      description: 'While digital design is rapidly growing, designing for print is still a useful skill to know. Graphic Designers should be familiar with bleeds, slug, crop, and fold marks, as well as with ink limits, dot gains, and transparency. They also need a thorough understanding of different file formats and color systems, as well as paper sizes, weights, and stocks.',
    },
    {
      name: 'UX and UI design',
      description: 'UX and UI skills can help Graphic Designers improve their work and stay competitive in the field. By understanding UX and UI, Graphic Designers can create designs that are both visually appealing and functional. Graphic Designers may sometimes work closely with UX and UI Designers, so understanding the fundamentals will allow them to better collaborate and communicate with team members.',
    },
  ]
};

const technologies = {
  data: [
    {
      name: 'Adobe Photoshop',
      className: 'adobe-photoshop',
      logo: adobePhotoshop,
    },
    {
      name: 'Adobe Illustrator',
      className: 'adobe-illustrator',
      logo: adobeIllustrator,
    },
    {
      name: 'Adobe XD',
      className: 'adobe-xd',
      logo: adobeXd,
    },
    {
      name: 'Adobe InDesign',
      className: 'adobe-indesign',
      logo: adobeInDesign,
    },
    {
      name: 'Adobe After Effects',
      className: 'adobe-after-effects',
      logo: adobeAfterEffects,
    },
    {
      name: 'Adobe Premiere Pro',
      className: 'adobe-premiere-pro',
      logo: adobePremierePro,
    },
  ]
};

const footer = {
  logo: 'logo.png',
  contact: {
    email: 'johndoe@gmail.com',
    phone: '+1 (123) 456 7890',
    address: '1234 Street Name, City, State, Country',
  },
  socialMedia: {
    data: [
      {
        name: 'facebook',
        icon: <TiSocialFacebookCircular />,
        url: 'https://www.facebook.com/',
      },
      {
        name: 'instagram',
        icon: <TiSocialInstagramCircular />,
        url: 'https://www.instagram.com/',
      },
      {
        name: 'linkedin',
        icon: <TiSocialLinkedinCircular />,
        url: 'https://www.linkedin.com/',
      },
      {
        name: 'twitter',
        icon: <TiSocialTwitterCircular />,
        url: 'https://twitter.com/',
      },
      {
        name: 'dribbble',
        icon: <TiSocialDribbble />,
        url: 'https://dribbble.com/',
      },
      {
        name: 'youtube',
        icon: <TiSocialYoutubeCircular />,
        url: 'https://www.youtube.com/',
      },
    ]
  },
  links: {
    data: [
      {
        name: 'Home',
        url: '/',
      },
      {
        name: 'Education',
        url: '/education',
      },
      {
        name: 'Experience',
        url: '/experience',
      },
      {
        name: 'Projects',
        url: '/projects',
      },
      {
        name: 'Contact',
        url: '/contact',
      },
    ]
  },
  copyRight: '© 2020 John Doe. All rights reserved.',
};

export {
  seo,
  navbar,
  greeting,
  socialMedia,
  skills,
  technologies,
  footer,
};