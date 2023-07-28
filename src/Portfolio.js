import {
  TiSocialDribbble,
  TiSocialFacebookCircular,
  TiSocialTwitterCircular,
  TiSocialInstagramCircular,
  TiSocialLinkedinCircular,
  TiSocialYoutubeCircular
} from 'react-icons/ti';

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
  logo: 'logo.png',
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
      name: 'Adobe Photoshop',
      percentage: 90,
    },
    {
      name: 'Adobe Illustrator',
      percentage: 80,
    },
    {
      name: 'Adobe XD',
      percentage: 70,
    },
    {
      name: 'Adobe InDesign',
      percentage: 60,
    },
    {
      name: 'Adobe After Effects',
      percentage: 50,
    },
    {
      name: 'Adobe Premiere Pro',
      percentage: 40,
    },
  ]
};

export {
  seo,
  navbar,
  greeting,
  socialMedia,
  skills,
};